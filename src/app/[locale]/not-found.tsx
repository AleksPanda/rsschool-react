import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import './not-found.scss';

export default async function NotFoundPage() {
  const t = await getTranslations('NotFoundPage');

  return (
    <section className="app__section not-found-page">
      <div className="not-found-page__content">
        <h2 className="app__section-title">{t('title')}</h2>
        <p className="not-found-page__description">{t('description')}</p>

        <Link className="app-button not-found-page__link" href="/">
          {t('returnHome')}
        </Link>
      </div>

      <Image
        className="not-found-page__image"
        src="/jerry.png"
        alt={t('imageAlt')}
        width={180}
        height={180}
      />
    </section>
  );
}
