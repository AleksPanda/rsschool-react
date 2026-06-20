import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import './AboutPage.scss';

export const dynamic = 'force-static';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/AleksPanda',
    label: 'GitHub',
    icon: '/github-icon.png',
    iconClassName: 'about-page__social-icon--github',
  },
  {
    href: 'https://www.linkedin.com/in/aleksandra-potapova-dev/',
    label: 'LinkedIn',
    icon: '/linkedIn-icon.png',
    iconClassName: '',
  },
];

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  return (
    <section className="app__section">
      <h2 className="app__section-title">{t('title')}</h2>

      <div className="about-page">
        <p className="about-page__text about-page__intro-text">{t('intro')}</p>

        <div className="about-page__social-section">
          <p className="about-page__section-label">{t('socialPrompt')}</p>

          <div className="about-page__socials">
            {SOCIAL_LINKS.map(({ href, label, icon, iconClassName }) => (
              <Link
                key={label}
                className="about-page__social-link"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  className={
                    iconClassName
                      ? `about-page__social-icon ${iconClassName}`
                      : 'about-page__social-icon'
                  }
                  src={icon}
                  alt=""
                  aria-hidden="true"
                  width={22}
                  height={22}
                />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <p className="about-page__tagline">{t('tagline')}</p>

        <p className="about-page__text">
          {t('coursePrefix')}{' '}
          <Link
            className="about-page__course-link"
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noreferrer"
          >
            {t('courseLink')}
          </Link>
          {t('courseSuffix')}
        </p>

        <Link className="app-button about-page__return-link" href="/">
          {t('returnHome')}
        </Link>
      </div>
    </section>
  );
}
