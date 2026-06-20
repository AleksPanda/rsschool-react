'use client';

import { useTranslations } from 'next-intl';
import type { JSX } from 'react';

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps): JSX.Element {
  const t = useTranslations('ErrorPage');

  return (
    <section className="app__section error-page">
      <h2 className="app__section-title">{t('title')}</h2>
      <p>{t('description')}</p>
      <button className="app-button" type="button" onClick={reset}>
        {t('retry')}
      </button>
    </section>
  );
}
