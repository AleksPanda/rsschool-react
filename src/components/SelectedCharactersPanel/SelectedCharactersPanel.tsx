'use client';

import { useTranslations } from 'next-intl';
import { useState, type JSX } from 'react';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloadError, setHasDownloadError] = useState(false);

  if (selectedCharacters.length === 0) {
    return null;
  }

  const downloadCsv = async (): Promise<void> => {
    setIsDownloading(true);
    setHasDownloadError(false);

    try {
      const response = await fetch('/api/export-selected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCharacters),
      });

      if (!response.ok) {
        throw new Error('Unable to export selected characters.');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');

      downloadLink.href = downloadUrl;
      downloadLink.download = `${selectedCharacters.length}_items.csv`;
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      setHasDownloadError(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <aside className="selected-characters-panel" aria-label={t('actionsLabel')}>
      <div>
        <p className="selected-characters-panel__summary">
          {t('selectedCount', { count: selectedCharacters.length })}
        </p>
        {hasDownloadError && (
          <p className="selected-characters-panel__error">{t('error')}</p>
        )}
      </div>

      <div className="selected-characters-panel__actions">
        <button
          className="selected-characters-panel__button selected-characters-panel__button--secondary"
          type="button"
          onClick={clearSelectedCharacters}
        >
          {t('unselectAll')}
        </button>

        <button
          className="selected-characters-panel__button"
          type="button"
          onClick={() => void downloadCsv()}
          disabled={isDownloading}
        >
          {isDownloading ? t('downloading') : t('download')}
        </button>
      </div>
    </aside>
  );
}
