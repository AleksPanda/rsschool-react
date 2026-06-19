import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <section className="app__section">
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
    </section>
  );
}
