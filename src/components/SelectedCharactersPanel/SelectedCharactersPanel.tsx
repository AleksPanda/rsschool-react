'use client';

import { useTranslations } from 'next-intl';
import type { JSX } from 'react';

import { useSelectedCharactersStore } from '../../store/selected-characters-store';
import './SelectedCharactersPanel.scss';

export default function SelectedCharactersPanel(): JSX.Element | null {
  const t = useTranslations('SelectedCharactersPanel');
  const selectedCharacters = useSelectedCharactersStore(
    (state) => state.selectedCharacters
  );
  const clearSelectedCharacters = useSelectedCharactersStore(
    (state) => state.clearSelectedCharacters
  );

  if (selectedCharacters.length === 0) {
    return null;
  }

  return (
    <aside className="selected-characters-panel" aria-label={t('actionsLabel')}>
      <p className="selected-characters-panel__summary">
        {t('selectedCount', { count: selectedCharacters.length })}
      </p>

      <div className="selected-characters-panel__actions">
        <button
          className="selected-characters-panel__button selected-characters-panel__button--secondary"
          type="button"
          onClick={clearSelectedCharacters}
        >
          {t('unselectAll')}
        </button>

        <form action="/api/export-selected" method="post">
          <input
            type="hidden"
            name="characters"
            value={JSON.stringify(selectedCharacters)}
          />
          <button className="selected-characters-panel__button" type="submit">
            {t('download')}
          </button>
        </form>
      </div>
    </aside>
  );
}
