import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages, type Locale } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import { buildOgImageUrl } from '@/lib/og';
import { TechHero } from '@/components/tech/TechHero';
import { SystemsGrid } from '@/components/tech/SystemsGrid';
import { ExperienceTimeline } from '@/components/tech/ExperienceTimeline';
import { TechAbout } from '@/components/tech/TechAbout';
import { CtaBand } from '@/components/marketing/CtaBand';
import { ContactSection } from '@/components/ContactSection';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);
  const ogImage = buildOgImageUrl({
    title: messages.hero.tech.title,
    subtitle: messages.hero.tech.tagline,
    audience: 'tech',
  });

  return {
    title: messages.hero.tech.title,
    description: messages.hero.tech.tagline,
    alternates: { canonical: `${SITE_URL}/${locale}/tech` },
    openGraph: { images: [ogImage] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

/**
 * The engineering path.
 *
 * Previously five sections with no structured data and no conversion step at
 * all — it ended on the contact form with nothing pointing at the case studies
 * that hold the actual substance. It now closes with a CTA into /tech/work.
 *
 * Deliberately NOT a mirror of the business page. No pricing, no pain points,
 * no FAQ: this audience is not buying, they are evaluating. The hero leads
 * with a spec sheet, the systems grid opens architecture detail in place, and
 * the density is higher throughout — mono metadata, tag lists, timeline rails.
 */
export default async function TechPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <TechHero locale={locale as Locale} />
      <SystemsGrid />
      <ExperienceTimeline />
      <TechAbout locale={locale as Locale} />
      <CtaBand locale={locale as Locale} variant="tech" />
      <ContactSection audience="tech" />
    </>
  );
}
