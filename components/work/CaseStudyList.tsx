import { getMessages, type Locale } from '@/i18n';
import { routes } from '@/lib/routes';
import type { Audience } from '@/lib/audience';

export function CaseStudyList({ audience, locale }: { audience: Audience; locale: Locale }) {
  const messages = getMessages(locale);
  const { items, map: ui } = messages.projects;

  return (
    <section className="py-20 case-study-list">
      <div className="mx-auto w-full max-w-7xl px-6 case-study-list__container">
        <div className="case-study-list__header">
          <span className="case-study-list__badge">{messages.work.listBadge}</span>
          <h1 className="case-study-list__title">{messages.work.listTitle}</h1>
          <p className="case-study-list__subtitle">{messages.work.listSubtitle}</p>
        </div>

        <div className="case-study-list__grid">
          {items.map((item) => {
            const perspective = audience === 'business' ? item.business : item.engineering;
            return (
              <a
                key={item.slug}
                href={routes.caseStudy(locale, audience, item.slug)}
                className="case-study-card"
              >
                <div className="case-study-card__top">
                  <h2 className="case-study-card__title">{item.title}</h2>
                  <span className={`case-study-card__status case-study-card__status--${item.status}`}>
                    {ui.status[item.status as keyof typeof ui.status] ?? item.status}
                  </span>
                </div>
                <p className="case-study-card__meta">
                  {item.sector}, {item.period}
                </p>
                <p className="case-study-card__summary">{perspective.summary}</p>
                <span className="case-study-card__cta">{messages.work.readMore} →</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
