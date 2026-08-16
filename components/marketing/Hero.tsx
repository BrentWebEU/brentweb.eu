import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { getMessages, type Locale } from '@/i18n';
import { routes } from '@/lib/routes';
import { Container } from './section';

/**
 * Commercial hero for the site root.
 *
 * Split out from the shared HeroSection, which stays on the engineering path.
 * Two deliberate departures from it:
 *
 *  · No framer-motion. The old hero drove a scroll-linked parallax and faded
 *    itself out via useTransform, which read as portfolio rather than practice
 *    and made the first paint depend on client JS. This is a server component
 *    and ships none.
 *
 *  · Not full-viewport. `min-h-screen` pushed every piece of evidence below
 *    the fold; the proof of what this page is selling should be reachable
 *    without a scroll gesture on a laptop.
 */
export function Hero({ locale }: { locale: Locale }) {
  const { hero } = getMessages(locale);
  const copy = hero.business;

  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Single soft wash, anchored top-right. Not a glow, not a mesh — just
          enough tonal shift to keep a white page from reading as unfinished. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-[42rem] w-[60%]
                   bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.06),transparent_62%)]"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <span className="block font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {copy.badge}
            </span>

            <h1
              className="mt-6 font-display text-[2.5rem] leading-[1.02] font-bold tracking-tight
                         text-foreground sm:text-5xl lg:text-6xl"
            >
              {copy.title}
            </h1>

            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
              {copy.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={routes.pricing(locale)}
                className="group inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5
                           text-sm font-medium text-primary-foreground no-underline
                           transition-colors duration-300 ease-out hover:bg-primary/90
                           focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                {copy.getInTouch}
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </a>

              <a
                href="#projects"
                className="inline-flex items-center rounded-sm border border-border px-6 py-3.5
                           text-sm font-medium text-foreground no-underline
                           transition-colors duration-300 ease-out hover:border-primary/50 hover:bg-primary/[0.03]
                           focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                {copy.viewProjects}
              </a>
            </div>

            {/* The two objections that matter most, answered before the fold. */}
            <p className="mt-8 max-w-[52ch] border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              {copy.trust}
            </p>

            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin aria-hidden className="h-4 w-4 opacity-60" />
              {hero.location}
            </p>
          </div>

          {/* Evidence, not decoration: a real client site, shipped and still
              running. Offset a column so the composition stays asymmetric. */}
          <figure className="lg:col-span-6 lg:col-start-7">
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
              <Image
                src="/images/ckris-small.png"
                alt="The Carrosserie Kris website, showing the workshop and repair services"
                width={1040}
                height={694}
                priority
                sizes="(min-width: 1024px) 46rem, 100vw"
                className="aspect-[3/2] w-full object-cover object-top"
              />
            </div>

            <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary">
                {hero.featured}
              </span>
              <span className="text-foreground">{hero.featuredProject}</span>
              <span aria-hidden className="text-border">
                /
              </span>
              <span className="text-muted-foreground">carrosseriekris.be</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
