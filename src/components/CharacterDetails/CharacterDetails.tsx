import { useEffect, useState, type JSX } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchCharacterById } from '../../api/character-service';
import type { Character } from '../../types';
import './CharacterDetails.scss';

function CharacterDetails(): JSX.Element {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [character, setCharacter] = useState<Character | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadedCharacterId, setLoadedCharacterId] = useState('');

  const detailsRequestId = characterId ?? '';
  const isLoading = loadedCharacterId !== detailsRequestId;
  const visibleErrorMessage = isLoading ? '' : errorMessage;

  useEffect(() => {
    if (!characterId) {
      return;
    }

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

  const handleClose = (): void => {
    navigate({
      pathname: '/',
      search: location.search,
    });
  };

  return (
    <article className="details-panel">
      <button
        className="details-panel__close-button"
        type="button"
        onClick={handleClose}
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
            <div className="details-panel__row">
              <dt>Status</dt>
              <dd>{character.status}</dd>
            </div>

            <div className="details-panel__row">
              <dt>Species</dt>
              <dd>{character.species}</dd>
            </div>

            {character.type && (
              <div className="details-panel__row">
                <dt>Type</dt>
                <dd>{character.type}</dd>
              </div>
            )}

            <div className="details-panel__row">
              <dt>Gender</dt>
              <dd>{character.gender}</dd>
            </div>

            <div className="details-panel__row">
              <dt>Origin</dt>
              <dd>{character.origin.name}</dd>
            </div>

            <div className="details-panel__row">
              <dt>Location</dt>
              <dd>{character.location.name}</dd>
            </div>

            {character.episode && (
              <div className="details-panel__row">
                <dt>Episodes</dt>
                <dd>
                  {character.episode.length}{' '}
                  {character.episode.length === 1 ? 'episode' : 'episodes'}
                </dd>
              </div>
            )}
          </dl>
        </>
      )}
    </article>
  );
}

export default CharacterDetails;
