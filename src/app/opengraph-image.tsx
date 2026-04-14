import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Creative Moon — Design-Driven Digital Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f0f0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px 90px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              fontSize: 18,
              color: '#ffffff',
              letterSpacing: '0.15em',
              fontWeight: 500,
              textTransform: 'uppercase',
            }}
          >
            CREATIVE MOON
          </div>
        </div>

        {/* Main copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Design-Driven
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#888888',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Digital Studio.
          </div>
        </div>

        {/* Bottom description */}
        <div
          style={{
            fontSize: 20,
            color: '#666666',
            letterSpacing: '0.01em',
            lineHeight: 1.5,
          }}
        >
          Strategy · Branding · Digital Products · Experiences
        </div>
      </div>
    ),
    { ...size }
  );
}
