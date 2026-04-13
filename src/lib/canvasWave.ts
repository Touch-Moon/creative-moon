/**
 * canvasWave.ts — WaveImage.tsx 와 동일한 파동 수학을 PageTransition 에서 재사용
 * WAVE_AMP / WAVE_SIGMA_PCT / WAVE_CYCLES / PULSE_SPEED 는 WaveImage 와 동일
 */

const WAVE_AMP       = 20;
const WAVE_SIGMA_PCT = 0.5;
const WAVE_CYCLES    = 0.5;
const PULSE_SPEED    = 0.032;

function drawFrame(canvas: HTMLCanvasElement, img: HTMLImageElement, p: number) {
  if (canvas.width === 0 || canvas.height === 0) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // ★ 이미지 로드 실패 시 빈 캔버스 유지 (에러 방지)
  if (!img.naturalWidth || !img.naturalHeight) return;

  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const ir = img.naturalWidth / img.naturalHeight;
  const cr = W / H;
  let sx: number, sy: number, sw: number, sh: number;

  if (ir > cr) {
    sh = img.naturalHeight; sw = sh * cr;
    sx = (img.naturalWidth - sw) / 2; sy = 0;
  } else {
    sw = img.naturalWidth; sh = sw / cr;
    sx = 0; sy = (img.naturalHeight - sh) / 2;
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
 * 이미지를 캔버스에 로드하고 첫 프레임(p=0) 렌더링.
 * 로드 완료 시 onReady(img) 호출.
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
  // 로드 실패해도 트랜지션은 계속 진행 (빈 캔버스)
  img.onerror = () => onReady(img);
  img.src = src;
}

/**
 * WaveImage 호버 효과와 동일한 파동 1회 실행.
 * 파동 완료 시 onComplete() 호출.
 * 페이지 트랜지션용이므로 딜레이 없이 즉시 시작.
 */
export function runWave(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
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
      onComplete(); // ★ 에러 발생해도 커튼 체인 진행
    }
  };
  rafId = requestAnimationFrame(loop);
}
