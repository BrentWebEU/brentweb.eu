import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages, type Locale } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import { buildOgImageUrl } from '@/lib/og';
import { buildBusinessSchema } from '@/lib/schema/business';
import { Hero } from '@/components/marketing/Hero';
import { PainPoints } from '@/components/marketing/PainPoints';
import { Services } from '@/components/marketing/Services';
import { PricingBands } from '@/components/marketing/PricingBands';
import { FaqSection } from '@/components/marketing/FaqSection';
import { About } from '@/components/marketing/About';
import { ProofSection } from '@/components/business/ProofSection';
import { ProcessSection } from '@/components/business/ProcessSection';
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
    title: messages.hero.business.title,
    subtitle: messages.hero.business.tagline,
    audience: 'business',
  });

  return {
    // This is the site root now, so it inherits the layout's title template
    // rather than declaring its own suffix.
    title: { absolute: `${messages.hero.business.title} | Brent Schoenmakers` },
    description: messages.hero.business.tagline,
    alternates: { canonical: `${SITE_URL}/${locale}` },
    openGraph: { images: [ogImage] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const businessSchema = buildBusinessSchema(locale);

  return (
    <>
      <script
        id="business-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/*
        Funnel order, and the reasoning for it:

          hook      Hero          — what this is, and what it costs to find out
          problem   PainPoints    — a symptom a non-technical buyer recognises
          solution  Services      — what I build, framed as outcomes
          evidence  Proof         — four systems still running in production
          price     Pricing       — published only after the work justifies it
          method    Process       — how an engagement actually runs
          objection FAQ           — ownership, breakage, cost, response time
          who       About         — the person who will do it
          action    Cta + Contact — hand-off into the form

        Evidence deliberately precedes price: a range means nothing until the
        reader believes the work behind it.

        StrategyMap is no longer here. It and ProofSection both render the same
        four projects, so the old page showed them twice under two headings.
        Proof makes the commercial argument (metrics, outcomes, named clients);
        StrategyMap's engineering/business split dialog now lives only on /tech,
        where that framing is the point.
      */}
      <Hero locale={locale as Locale} />
      <PainPoints locale={locale as Locale} />
      <Services locale={locale as Locale} />
      <ProofSection locale={locale as Locale} />
      <PricingBands locale={locale as Locale} />
      <ProcessSection locale={locale as Locale} />
      <FaqSection locale={locale as Locale} />
      <About locale={locale as Locale} />
      <CtaBand locale={locale as Locale} variant="closing" />
      <ContactSection audience="business" />
    </>
  );
}
