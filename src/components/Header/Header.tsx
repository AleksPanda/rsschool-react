'use client';

import { useTranslations } from 'next-intl';
import type { JSX } from 'react';

import { Link } from '../../i18n/navigation';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';
import './Header.scss';

function Header(): JSX.Element {
  const t = useTranslations('Header');

  return (
    <header className="app__section header-panel">
      <div className="header-panel__content">
        <h1 className="header-panel__title">{t('title')}</h1>
        <p className="header-panel__description">{t('description')}</p>

        <div className="header-panel__actions">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link className="app-button" href="/about">
            {t('about')}
          </Link>
        </div>
      </div>

      <img
        className="header-panel__image"
        src="/rick-n-morty.png"
        alt={t('imageAlt')}
      />
    </header>
  );
}

export default Header;
