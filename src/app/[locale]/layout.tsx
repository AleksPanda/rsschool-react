import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import Header from '@/components/Header';
import ThemeProvider from '@/context/theme-provider';
import { routing } from '@/i18n/routing';
import '../globals.scss';

export const metadata: Metadata = {
  title: 'Rick and Morty Character Search',
  description: 'Search for characters from the Rick and Morty API.',
  icons: {
    icon: '/rick-favicon.png',
  },
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <main className="app">
              <Header />
              {children}
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
