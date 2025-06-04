import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { defaultLocale } from '@/i18n/config';
import './globals.css';
import { ThemeProvider } from '@/core/theme/presentation/providers/theme.provider';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { ReactQueryProvider } from '@/core/providers/react-query-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sicrux Teams',
  description: 'Sicrux Teams',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get('X-NEXT-INTL-LOCALE') ?? defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' ||
                    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <SonnerToaster richColors />
          <ReactQueryDevtools />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
