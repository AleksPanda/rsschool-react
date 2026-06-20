'use client';

import { useTranslations } from 'next-intl';
import type { JSX } from 'react';

import { useTheme } from '../../hooks/use-theme';

function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('ThemeToggle');

  return (
    <button
      className="app-button"
      type="button"
      onClick={toggleTheme}
      aria-pressed={theme === 'light'}
    >
      {theme === 'dark' ? t('light') : t('dark')}
    </button>
  );
}

export default ThemeToggle;
