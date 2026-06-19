'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition, type JSX } from 'react';

import { usePathname, useRouter } from '../../i18n/navigation';
import { routing } from '../../i18n/routing';
import './LanguageSwitcher.scss';

function LanguageSwitcher(): JSX.Element {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('LanguageSwitcher');
  const [isPending, startTransition] = useTransition();

  const changeLocale = (nextLocale: (typeof routing.locales)[number]): void => {
    if (nextLocale === locale) {
      return;
    }

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="language-switcher" aria-label={t('label')}>
      {routing.locales.map((availableLocale) => (
        <button
          key={availableLocale}
          className="language-switcher__button"
          type="button"
          aria-pressed={availableLocale === locale}
          disabled={isPending}
          onClick={() => changeLocale(availableLocale)}
        >
          {availableLocale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
