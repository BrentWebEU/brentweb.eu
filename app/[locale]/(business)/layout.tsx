import { notFound } from 'next/navigation';
import { getMessages } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);

  return (
    <div className="audience-shell" data-audience="business">
      <Navigation locale={locale} audience="business" nav={messages.nav} />
      <main id="main">{children}</main>
      <Footer locale={locale} audience="business" />
    </div>
  );
}
