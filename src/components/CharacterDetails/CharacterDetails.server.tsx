import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { JSX } from 'react';

import { Link } from '../../i18n/navigation';
import type { Character } from '../../types';
import './CharacterDetails.scss';

interface ServerCharacterDetailsProps {
  character: Character | null;
  hasLoadError: boolean;
  currentPage: number;
  searchTerm: string;
}

interface CharacterDetailsRowProps {
  label: string;
  value: string | number;
}

function CharacterDetailsRow({
  label,
  value,
}: CharacterDetailsRowProps): JSX.Element {
  return (
    <div className="details-panel__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function createCloseHref(currentPage: number, searchTerm: string): string {
  const params = new URLSearchParams({ page: String(currentPage) });

  if (searchTerm) {
    params.set('search', searchTerm);
  }

  return `/?${params.toString()}`;
}

export default async function ServerCharacterDetails({
  character,
  hasLoadError,
  currentPage,
  searchTerm,
}: ServerCharacterDetailsProps): Promise<JSX.Element> {
  const t = await getTranslations('CharacterDetails');

  return (
    <article className="details-panel">
      <div className="details-panel__actions details-panel__actions--server">
        <Link
          className="details-panel__close-button"
          href={createCloseHref(currentPage, searchTerm)}
          aria-label={t('close')}
        >
          &times;
        </Link>
      </div>

      {hasLoadError || !character ? (
        <p className="results-placeholder results-placeholder--error">
          {t('loadError')}
        </p>
      ) : (
        <>
          <Image
            className="details-panel__image"
            src={character.image}
            alt={character.name}
            width={240}
            height={240}
          />

          <h3 className="details-panel__title">{character.name}</h3>

          <dl className="details-panel__list">
            <CharacterDetailsRow label={t('status')} value={character.status} />
            <CharacterDetailsRow
              label={t('species')}
              value={character.species}
            />

            {character.type && (
              <CharacterDetailsRow label={t('type')} value={character.type} />
            )}

            <CharacterDetailsRow label={t('gender')} value={character.gender} />
            <CharacterDetailsRow
              label={t('origin')}
              value={character.origin.name}
            />
            <CharacterDetailsRow
              label={t('location')}
              value={character.location.name}
            />

            {character.episode && (
              <CharacterDetailsRow
                label={t('episodes')}
                value={t('episodeCount', {
                  count: character.episode.length,
                })}
              />
            )}
          </dl>
        </>
      )}
    </article>
  );
}
