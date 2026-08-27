import { ImageResponse } from 'next/og';
import { BRAND_COLORS_DARK } from '@/lib/brand-tokens';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Brent Schoenmakers';
  const subtitle = searchParams.get('subtitle');
  const audience = searchParams.get('audience');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BRAND_COLORS_DARK.background,
          color: BRAND_COLORS_DARK.foreground,
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: BRAND_COLORS_DARK.primary,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {`brentweb.be${audience ? `, ${audience}` : ''}`}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 28, color: BRAND_COLORS_DARK.mutedForeground, maxWidth: 850 }}>{subtitle}</div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
