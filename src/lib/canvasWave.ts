/**
 * canvasWave.ts — reuses the same wave math as WaveImage.tsx inside PageTransition
 * WAVE_AMP / WAVE_SIGMA_PCT / WAVE_CYCLES / PULSE_SPEED are identical to those in WaveImage
 */

const WAVE_AMP       = 20;
const WAVE_SIGMA_PCT = 0.5;
const WAVE_CYCLES    = 0.5;
const PULSE_SPEED    = 0.032;

// Wave source can be an image OR a (paused) video frame. drawImage accepts both;
// since we never read pixels back, a cross-origin video taints the canvas harmlessly.
type WaveSource = HTMLImageElement | HTMLVideoElement;

function srcDims(src: WaveSource): { w: number; h: number } {
  return {
    w: (src as HTMLImageElement).naturalWidth || (src as HTMLVideoElement).videoWidth || 0,
    h: (src as HTMLImageElement).naturalHeight || (src as HTMLVideoElement).videoHeight || 0,
  };
}

function drawFrame(canvas: HTMLCanvasElement, img: WaveSource, p: number) {
  if (canvas.width === 0 || canvas.height === 0) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // ★ Keep canvas empty if the source has no frame yet (prevents errors)
  const { w: nw, h: nh } = srcDims(img);
  if (!nw || !nh) return;

  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const ir = nw / nh;
  const cr = W / H;
  let sx: number, sy: number, sw: number, sh: number;

  if (ir > cr) {
    sh = nh; sw = sh * cr;
    sx = (nw - sw) / 2; sy = 0;
  } else {
    sw = nw; sh = sw / cr;
    sx = 0; sy = (nh - sh) / 2;
  }

  if (p === 0) {
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    return;
  }

  const sigma      = W * WAVE_SIGMA_PCT;
  const sigmaSq    = sigma * sigma;
  const waveCenter = W + sigma * 1.5 - p * (W + sigma * 3);
  const freq       = (Math.PI * 2 * WAVE_CYCLES) / (sigma * 2);
  const dpr        = window.devicePixelRatio || 1;
  const ampPx      = WAVE_AMP * dpr;
  const colW       = Math.max(1, Math.round(dpr));

  for (let x = 0; x < W; x += colW) {
    const d     = x - waveCenter;
    const gauss = Math.exp(-(d * d) / sigmaSq);
    const dy    = ampPx * Math.sin(d * freq) * gauss;
    const srcX  = sx + (x / W) * sw;
    const srcW  = Math.max((colW / W) * sw, 0.5);
    ctx.drawImage(img, srcX, sy, srcW, sh, x, dy, colW, H);
  }
}

/**
 * Load an image onto the canvas and render the first frame (p=0).
 * Calls onReady(img) when loading is complete.
 */
export function initCanvas(
  canvas: HTMLCanvasElement,
  src: string,
  onReady: (img: HTMLImageElement) => void,
): void {
  const img = new window.Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const dpr     = window.devicePixelRatio || 1;
    canvas.width  = Math.round(canvas.offsetWidth  * dpr);
    canvas.height = Math.round(canvas.offsetHeight * dpr);
    drawFrame(canvas, img, 0);
    onReady(img);
  };
  // Transition continues even on load failure (empty canvas)
  img.onerror = () => onReady(img);
  img.src = src;
}

/**
 * Run one wave pass identical to the WaveImage hover effect.
 * Calls onComplete() when the wave finishes.
 * Starts immediately without delay since this is for page transitions.
 */
/** Draw a single static frame (p=0) from an image or video source. */
export function drawStill(canvas: HTMLCanvasElement, src: WaveSource): void {
  drawFrame(canvas, src, 0);
}

export function runWave(
  canvas: HTMLCanvasElement,
  img: WaveSource,
  onComplete: () => void,
): void {
  let progress = 0;
  let rafId    = 0;

  const loop = () => {
    try {
      progress += PULSE_SPEED;
      if (progress >= 1) {
        drawFrame(canvas, img, 0);
        cancelAnimationFrame(rafId);
        onComplete();
        return;
      }
      drawFrame(canvas, img, progress);
      rafId = requestAnimationFrame(loop);
    } catch (err) {
      console.error('[canvasWave] drawFrame error:', err);
      cancelAnimationFrame(rafId);
      onComplete(); // ★ Continue curtain chain even if an error occurs
    }
  };
  rafId = requestAnimationFrame(loop);
}
