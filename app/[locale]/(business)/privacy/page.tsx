import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages, locales } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import { routes } from '@/lib/routes';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);

  return {
    title: { absolute: `${messages.privacy.title} | Brent Schoenmakers` },
    description: messages.privacy.title,
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/privacy`])),
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);
  const { privacy } = messages;
  const lastUpdated = privacy.lastUpdated.replace(
    '{date}',
    // Deliberately NOT the build date: this is a legal document, and its
    // "last updated" must be the day the policy text itself changed. Kept in
    // the message bundle so the wording and its date are edited together.
    new Date(privacy.lastUpdatedDate).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );

  return (
    // A <div>, not a <main>: this page now sits inside the (business) shell,
    // which already provides <main id="main">. It used to live outside both
    // audience shells and render its own landmark — and consequently had no
    // navigation or footer at all.
    <div className="privacy">
      <div className="privacy__container">
        <h1 className="privacy__title">{privacy.title}</h1>
        <p className="privacy__updated">
          <em>{lastUpdated}</em>
        </p>

        {privacy.sections.map((section) => (
          <section key={section.title} className="privacy__section">
            <h2 className="privacy__section-title">{section.title}</h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="privacy__p">
                {paragraph}
              </p>
            ))}

            {section.list && (
              <ul className="privacy__list">
                {section.list.map((item) => (
                  <li key={item.text}>
                    {'label' in item && <strong>{item.label} </strong>}
                    {item.text}
                  </li>
                ))}
              </ul>
            )}

            {section.afterList?.map((paragraph) => (
              <p key={paragraph} className="privacy__p">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <div className="privacy__back">
          <a href={routes.home(locale)}>{privacy.backHome}</a>
        </div>
      </div>
    </div>
  );
}
