import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import { routes } from '@/lib/routes';
import { buildOgImageUrl } from '@/lib/og';
import { getProjectSlugs } from '@/lib/case-studies';
import { CaseStudyDetail } from '@/components/work/CaseStudyDetail';

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);
  const project = messages.projects.items.find((item) => item.slug === slug);
  if (!project) notFound();

  const ogImage = buildOgImageUrl({ title: project.title, subtitle: project.engineering.summary, audience: 'tech' });

  return {
    title: `${project.title} | ${messages.work.metaTitleList}`,
    description: project.engineering.summary,
    alternates: { canonical: `${SITE_URL}${routes.caseStudy(locale, 'tech', slug)}` },
    openGraph: { images: [ogImage] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
  };
}

export default async function TechCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  return <CaseStudyDetail audience="tech" slug={slug} locale={locale} />;
}
