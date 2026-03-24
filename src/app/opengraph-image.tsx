import { ImageResponse } from 'next/og';

export const alt = 'Casey Dunham — Designer & Builder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#181818',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#EDEDED',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 32,
            maxWidth: 800,
          }}
        >
          Casey Dunham
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#8A8A8A',
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          Product design, UX/UI, visual art, and engineering.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            width: 48,
            height: 48,
            borderRadius: 24,
            background: '#9CA5FF',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
