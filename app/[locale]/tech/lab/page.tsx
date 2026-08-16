import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import { routes } from '@/lib/routes';
import { LabWidgets } from '@/components/tech/lab/LabWidgets';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);

  return {
    title: messages.lab.metaTitle,
    description: messages.lab.metaDescription,
    alternates: { canonical: `${SITE_URL}${routes.lab(locale)}` },
  };
}

export default async function LabPage({
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
        {/* Left-aligned, unboxed eyebrow — matches every other section header.
            The old version centred this and set min-height:100svh on the
            wrapper, which pushed the widgets themselves below the fold. */}
        <header className="max-w-3xl">
          <span className="block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {messages.lab.badge}
          </span>
          <h1 className="mt-5 font-display text-3xl leading-[1.08] font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            {messages.lab.title}
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            {messages.lab.subtitle}
          </p>
        </header>

        <div className="mt-14 md:mt-16">
          <LabWidgets />
        </div>
      </div>
    </section>
  );
}
