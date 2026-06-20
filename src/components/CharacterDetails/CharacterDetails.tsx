import type { JSX } from 'react';
import { fetchCharacterById } from '../../services/character-service';
import './CharacterDetails.scss';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    isPending: isInitialLoading,
    isFetching,
  } = useQuery({
    queryKey: characterQueryKeys.detail(characterId),
    queryFn: ({ signal }) => fetchCharacterById(characterId, signal),
  });

  const isRefreshing = isFetching && !isInitialLoading;

  const queryClient = useQueryClient();

  const handleRefreshDetails = (): void => {
    void queryClient.invalidateQueries({
      queryKey: characterQueryKeys.detail(characterId),
    });
  };

  const visibleErrorMessage = isInitialLoading
    ? ''
    : error
      ? CHARACTER_DETAILS_ERROR_MESSAGE
      : '';
  const shouldShowLoader = isFetching;

  return (
    <article className="details-panel">
      <div className="details-panel__actions">
        <button
          className="pagination__button details-panel__refresh-button"
          type="button"
          onClick={handleRefreshDetails}
        >
          {isRefreshing ? 'Refreshing details...' : 'Refresh details'}
        </button>

        <button
          className="details-panel__close-button"
          type="button"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      {shouldShowLoader && (
        <p className="results-placeholder">
          Loading details<span className="loading-dots"></span>
        </p>
      )}

      {visibleErrorMessage && (
        <p className="results-placeholder results-placeholder--error">
          {visibleErrorMessage}
        </p>
      )}

      {!isInitialLoading && !visibleErrorMessage && character && (
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
