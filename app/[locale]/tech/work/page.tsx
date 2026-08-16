import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import { routes } from '@/lib/routes';
import { CaseStudyList } from '@/components/work/CaseStudyList';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);

  return {
    title: messages.work.metaTitleList,
    description: messages.work.metaDescriptionList,
    alternates: { canonical: `${SITE_URL}${routes.work(locale, 'tech')}` },
  };
}

export default async function TechWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <CaseStudyList audience="tech" locale={locale} />;
}
