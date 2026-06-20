import { getTranslations } from 'next-intl/server';
import type { JSX } from 'react';

import { searchCharacters } from '@/app/[locale]/actions';
import './SearchForm.scss';

interface SearchFormProps {
  defaultValue: string;
}

export default async function SearchForm({
  defaultValue,
}: SearchFormProps): Promise<JSX.Element> {
  const t = await getTranslations('SearchForm');

  return (
    <div className="search-panel">
      <label className="search-panel__label" htmlFor="character-search">
        {t('label')}
      </label>

      <form className="search-panel__controls" action={searchCharacters}>
        <input
          id="character-search"
          className="search-panel__input"
          name="search"
          type="search"
          placeholder={t('placeholder')}
          defaultValue={defaultValue}
        />

        <button className="search-panel__button" type="submit">
          {t('submit')}
        </button>
      </form>
    </div>
  );
}
