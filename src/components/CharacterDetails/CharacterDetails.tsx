import type { JSX } from 'react';
import { fetchCharacterById } from '../../api/character-service';
import './CharacterDetails.scss';
import { useQuery } from '@tanstack/react-query';
import { characterQueryKeys } from '../../api/query-keys';

interface CharacterDetailsProps {
  characterId: string;
  onClose: () => void;
}

interface CharacterDetailsRowProps {
  label: string;
  value: string | number;
}

const CHARACTER_DETAILS_ERROR_MESSAGE =
  'Unable to load character details. Please try again later.';

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

function CharacterDetails({
  characterId,
  onClose,
}: CharacterDetailsProps): JSX.Element {
  const {
    data: character,
    error,
    isPending,
  } = useQuery({
    queryKey: characterQueryKeys.detail(characterId),
    queryFn: ({ signal }) => fetchCharacterById(characterId, signal),
  });

  const isLoading = isPending;
  const visibleErrorMessage = isLoading
    ? ''
    : error
      ? CHARACTER_DETAILS_ERROR_MESSAGE
      : '';

  return (
    <article className="details-panel">
      <button
        className="details-panel__close-button"
        type="button"
        onClick={onClose}
        aria-label="Close details"
      >
        ×
      </button>

      {isLoading && (
        <p className="results-placeholder">
          Loading details<span className="loading-dots">...</span>
        </p>
      )}

      {visibleErrorMessage && (
        <p className="results-placeholder results-placeholder--error">
          {visibleErrorMessage}
        </p>
      )}

      {!isLoading && !visibleErrorMessage && character && (
        <>
          <img
            className="details-panel__image"
            src={character.image}
            alt={character.name}
          />

          <h3 className="details-panel__title">{character.name}</h3>

          <dl className="details-panel__list">
            <CharacterDetailsRow label="Status" value={character.status} />
            <CharacterDetailsRow label="Species" value={character.species} />

            {character.type && (
              <CharacterDetailsRow label="Type" value={character.type} />
            )}

            <CharacterDetailsRow label="Gender" value={character.gender} />
            <CharacterDetailsRow label="Origin" value={character.origin.name} />
            <CharacterDetailsRow
              label="Location"
              value={character.location.name}
            />

            {character.episode && (
              <CharacterDetailsRow
                label="Episodes"
                value={`${character.episode.length} ${
                  character.episode.length === 1 ? 'episode' : 'episodes'
                }`}
              />
            )}
          </dl>
        </>
      )}
    </article>
  );
}

export default CharacterDetails;
