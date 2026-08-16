import { notFound } from 'next/navigation';
import { getMessages, type Locale } from '@/i18n';
import { getCaseStudy } from '@/lib/case-studies';
import { routes } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';
import type { Audience } from '@/lib/audience';

export async function CaseStudyDetail({
  audience,
  slug,
  locale,
}: {
  audience: Audience;
  slug: string;
  locale: Locale;
}) {
  const messages = getMessages(locale);
  const project = messages.projects.items.find((item) => item.slug === slug);

  // Only a genuinely unknown slug 404s — a known project without an MDX
  // write-up yet falls back to the summary already in messages/*.json.
  if (!project) notFound();

  const caseStudy = await getCaseStudy(audience, slug, locale);
  const perspective = audience === 'business' ? project.business : project.engineering;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: messages.work.listTitle, item: `${SITE_URL}${routes.work(locale, audience)}` },
      { '@type': 'ListItem', position: 2, name: project.title, item: `${SITE_URL}${routes.caseStudy(locale, audience, slug)}` },
    ],
  };

  return (
    <article className="case-study">
      <script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <a href={routes.work(locale, audience)} className="case-study__back">
        {messages.work.backToList}
      </a>

      <header className="case-study__header">
        <h1 className="case-study__title">{caseStudy?.frontmatter.title ?? project.title}</h1>
        <p className="case-study__meta">
          {project.sector}, {project.period}
        </p>
      </header>

      {caseStudy ? (
        <div className="case-study__body">{caseStudy.content}</div>
      ) : (
        <div className="case-study__body">
          <p className="case-study__p">{perspective.summary}</p>
          <p className="case-study__coming-soon">{messages.work.comingSoon}</p>
        </div>
      )}

      {(project.liveUrl || project.githubUrl) && (
        <footer className="case-study__footer">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="case-study__link">
              {messages.projects.map.liveLink}
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="case-study__link">
              {messages.projects.map.sourceLink}
            </a>
          )}
        </footer>
      )}
    </article>
  );
}
