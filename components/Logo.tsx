/**
 * Inlined from public/logo.svg.
 *
 * The file version hardcodes `fill: #ffffff` on the primary marks, which was
 * invisible the moment the site stopped defaulting to a dark theme. Loaded
 * through next/image it renders as an <img>, so no page CSS — variables or
 * otherwise — can reach inside it to fix that.
 *
 * Inlining lets the mark inherit `currentColor`, so it is correct on any
 * background in either theme. Only the accent stays a fixed brand red.
 */
/**
 * Tightened from the source file's "0 0 1024 768". The artwork actually
 * occupies x 237.4–858 / y 326.4–441.7 — roughly 8% of that canvas — so at a
 * 2rem nav height the wordmark rendered near-illegible, both as an <img> and
 * inline. Measured with getBBox(), plus ~2 units of breathing room. The right
 * edge came in from 879.5 when the tagline tracking was evened out.
 */
const VIEW_BOX = '235 324 625 120';

/** Brand red, as authored in public/logo.svg. */
const ACCENT = '#eb4a4c';

type Tone = 'mark' | 'accent' | 'slogan';

/**
 * The wordmark as data rather than markup, so consumers can address individual
 * glyphs from CSS — `[data-tone]` for colour, `--i` for stagger order. The
 * preloader (styles/components/preloader.css) draws them one at a time on that
 * index; nothing else depends on the order, so it is authored as read order:
 * "Brent" → "web" → tagline.
 *
 * Painting order is irrelevant here because no two glyphs overlap, which is
 * why flattening the source file's <g id="slogan"> / <g id="title"> grouping
 * costs nothing.
 */
const PATHS: { d: string; tone: Tone }[] = [
  // "Brent"
  {
    tone: 'mark',
    d: 'M285.2,362.2c-2.3-2.7-5.8-4.4-10.3-5.3,3.1-1,5.8-2.8,7.6-5.3,1.9-2.4,2.9-5.4,2.9-9.1s-2-9.1-5.8-11.9-9.1-4.2-15.9-4.2h-26.3v4h26.1c5.5,0,9.7,1.1,12.7,3.2s4.5,5.2,4.5,9.3-1.5,7.3-4.5,9.4c-3,2.2-7.2,3.2-12.7,3.2h-26.1v4h28.1c6,0,10.7,1.1,13.9,3.2,3.1,2.2,4.8,5.4,4.8,9.8s-1.6,7.7-4.8,9.9c-3.1,2.2-7.7,3.1-13.9,3.1h-28.1v4h28.1c7.6,0,13.4-1.4,17.4-4.3,3.9-2.9,5.8-6.9,5.8-12.3s-1.3-7.7-3.6-10.5h0Z',
  },
  {
    tone: 'mark',
    d: 'M338.4,367.4c4.7-1.3,8.4-3.7,10.9-7.1s3.9-7.6,3.9-12.6-2.2-11.8-6.8-15.6c-4.5-3.8-10.7-5.7-18.6-5.7h-22.6v4.1h22.6c6.7,0,11.8,1.5,15.4,4.5,3.5,3,5.3,7.2,5.3,12.6s-1.8,9.7-5.3,12.7c-3.6,3-8.7,4.4-15.4,4.4h-22.6v24.7h4.6v-20.6h18c1.8,0,3.9,0,6.1-.5l15,21.1h5.2l-15.8-22Z',
  },
  {
    tone: 'mark',
    d: 'M410.8,355.4h-40.8v4h40.8v-4ZM410.8,326.4h-40.8v4.1h40.8v-4.1ZM370.1,385.3v4.1h40.8v-4.1h-40.8Z',
  },
  {
    tone: 'mark',
    d: 'M481.7,326.4h-4.6v54.7l-42.8-54.7h-3.9v63h4.6v-54.7l42.9,54.7h3.8v-63Z',
  },
  { tone: 'mark', d: 'M515.7,330.6v58.9h4.6v-58.9h22.7v-4.1h-49.9v4.1h22.7Z' },
  // "web"
  {
    tone: 'accent',
    d: 'M661.7,326.4h-4.5l-19.3,56.8-19.6-56.8h-4.4l-19.7,56.7-19.2-56.7h-4.9l21.4,63h4.9l19.6-56.5,19.5,56.5h4.9l21.3-63Z',
  },
  {
    tone: 'accent',
    d: 'M715.6,355.4h-40.8v4h40.8v-4ZM715.6,326.4h-40.8v4.1h40.8v-4.1ZM674.9,385.3v4.1h40.8v-4.1h-40.8Z',
  },
  {
    tone: 'accent',
    d: 'M782.9,362.2c-2.3-2.7-5.8-4.4-10.3-5.3,3.2-1,5.8-2.8,7.6-5.3,1.9-2.4,2.9-5.4,2.9-9.1s-2-9.1-5.8-11.9-9.1-4.2-15.9-4.2h-26.3v4h26.1c5.5,0,9.7,1.1,12.7,3.2,3,2.2,4.5,5.2,4.5,9.3s-1.5,7.3-4.5,9.4c-3,2.2-7.2,3.2-12.7,3.2h-26.1v4h28.1c6,0,10.7,1.1,13.9,3.2,3.2,2.2,4.8,5.4,4.8,9.8s-1.6,7.7-4.8,9.9c-3.2,2.2-7.7,3.1-13.9,3.1h-28.1v4h28.1c7.6,0,13.4-1.4,17.4-4.3,3.9-2.9,5.8-6.9,5.8-12.3s-1.3-7.7-3.6-10.5Z',
  },
  // tagline glyphs
  {
    tone: 'slogan',
    d: 'M738.2,440.9c.4.4,1,.7,1.7.7s1.2-.2,1.6-.7c.4-.4.7-1.1.7-1.7s-.3-1.2-.7-1.7c-.4-.4-1-.7-1.6-.7s-1.2.2-1.7.7c-.4.4-.7,1-.7,1.7s.2,1.3.7,1.7Z',
  },
  {
    tone: 'slogan',
    d: 'M772.2,400H775V441.4H772.2ZM800.1,426.8a13.95,14.9 0 1,1 -27.9,0a13.95,14.9 0 1,1 27.9,0ZM797.3,426.8a11.15,12.5 0 1,0 -22.3,0a11.15,12.5 0 1,0 22.3,0Z',
  },
  {
    tone: 'slogan',
    d: 'M850.6,438.1c-1.6.7-3.4,1-5.3,1-3,0-5.5-.8-7.7-2.4-2.1-1.6-3.6-3.7-4.3-6.4l24.7-4.8c-.2-2.6-.8-4.9-2-6.9s-2.9-3.7-4.9-4.9-4.3-1.8-6.8-1.8-5.2.7-7.3,1.9c-2.2,1.3-3.9,3-5.1,5.3-1.2,2.2-1.8,4.8-1.8,7.7s.6,5.4,1.9,7.7c1.3,2.2,3.1,4,5.4,5.3,2.3,1.3,4.9,1.9,7.8,1.9s4.3-.4,6.3-1.2c1.8-.8,3.5-2,4.8-3.6l-1.6-1.8c-1.1,1.4-2.5,2.4-4.1,3.1h0ZM838.5,415.9c1.7-1,3.7-1.6,5.9-1.6s3.7.4,5.3,1.3c1.6.8,2.8,2,3.8,3.4,1,1.5,1.6,3.1,1.8,4.8l-22.3,4.4c-.1-.7-.1-1.3-.1-1.7,0-2.3.4-4.4,1.5-6.3,1-1.8,2.3-3.3,4.1-4.3Z',
  },
];

const FILL: Record<Tone, string> = {
  mark: 'currentColor',
  accent: ACCENT,
  slogan: 'currentColor',
};

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={VIEW_BOX}
      className={className}
      role="img"
      aria-label="Brent Schoenmakers"
      xmlns="http://www.w3.org/2000/svg"
    >
      {PATHS.map(({ d, tone }, i) => (
        <path
          key={d.slice(0, 24)}
          d={d}
          data-tone={tone}
          fill={FILL[tone]}
          /* Normalises every contour to a length of 1 so a single
           * stroke-dasharray value draws them all at the same rate,
           * regardless of how long the real outline is. Inert unless
           * something applies a stroke. */
          pathLength={1}
          opacity={tone === 'slogan' ? 0.92 : undefined}
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
