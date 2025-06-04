import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { Toaster } from '@/components/ui/sonner';
import NotificationProvider from '@/components/ui/notification-provider';
import { AuthInitializerWrapper } from '@/core/auth/auth-initializer-wrapper';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let messages;

  try {
    messages = (await import(`../../locale/${locale}.json`)).default;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthInitializerWrapper />
      {children}
      <Toaster position="top-left" />
      <NotificationProvider />
    </NextIntlClientProvider>
  );
}
