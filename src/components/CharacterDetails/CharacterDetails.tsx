import { useEffect, useState, type JSX } from 'react';
import { fetchCharacterById } from '../../api/character-service';
import type { Character } from '../../types';
import './CharacterDetails.scss';

interface CharacterDetailsProps {
  characterId: string;
  onClose: () => void;
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

function CharacterDetails({
  characterId,
  onClose,
}: CharacterDetailsProps): JSX.Element {
  const [character, setCharacter] = useState<Character | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadedCharacterId, setLoadedCharacterId] = useState('');

  const detailsRequestId = characterId ?? '';
  const isLoading = loadedCharacterId !== detailsRequestId;
  const visibleErrorMessage = isLoading ? '' : errorMessage;

  useEffect(() => {
    const currentCharacterId = characterId;

    const controller = new AbortController();

    async function loadCharacterDetails(): Promise<void> {
      try {
        const data = await fetchCharacterById(
          currentCharacterId,
          controller.signal
        );

        if (controller.signal.aborted) {
          return;
        }

        setCharacter(data);
        setErrorMessage('');
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setCharacter(null);
        setErrorMessage(
          'Unable to load character details. Please try again later.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadedCharacterId(currentCharacterId);
        }
      }
    }

    void loadCharacterDetails();

    return () => {
      controller.abort();
    };
  }, [characterId]);

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
