import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import { routes } from '@/lib/routes';
import { CostEstimator } from '@/components/calculator/CostEstimator';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);

  return {
    title: messages.calculator.metaTitle,
    description: messages.calculator.metaDescription,
    alternates: { canonical: `${SITE_URL}${routes.pricing(locale)}` },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <header className="max-w-3xl">
          <span className="block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {messages.calculator.badge}
          </span>
          <h1 className="mt-5 font-display text-3xl leading-[1.08] font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            {messages.calculator.title}
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            {messages.calculator.subtitle}
          </p>
        </header>

        <div className="mt-14 md:mt-16">
          <CostEstimator locale={locale} />
        </div>
      </div>
    </section>
  );
}
