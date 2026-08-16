import { notFound } from 'next/navigation';
import { getMessages } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import DevToolsEasterEgg from '@/components/DevToolsEasterEgg';

export default async function TechLayout({
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
    <div className="audience-shell" data-audience="tech">
      <DevToolsEasterEgg />
      <Navigation locale={locale} audience="tech" nav={messages.nav} />
      <main id="main">{children}</main>
      <Footer locale={locale} audience="tech" />
    </div>
  );
}
