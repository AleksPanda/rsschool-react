import type { JSX, ReactNode } from 'react';
import type { Character } from '../../types';
import { Link } from 'react-router-dom';
import './CharacterList.scss';

interface CharacterListProps {
  characters: Character[];
  errorMessage: string;
  isLoading: boolean;
  placeholder: string;
  detailsOutlet?: ReactNode;
  getDetailsPath?: (characterId: number) => string;
  selectedCharacterId?: number | null;
  selectedCharacterIds: number[];
  onToggleCharacterSelection: (characterId: number) => void;
}

interface CharacterListContentProps {
  character: Character;
}

interface CharacterListItemProps {
  character: Character;
  detailsPath?: string;
  isSelected: boolean;
  onToggleSelection: (characterId: number) => void;
}

function CharacterListContent({
  character,
}: CharacterListContentProps): JSX.Element {
  return (
    <>
      <div className="character-list__content">
        <h3 className="character-list__name">
          <span className="character-list__name--title">Name:</span>
          <span className="character-list__value">{character.name}</span>
        </h3>

        <p className="character-list__description">
          <span className="character-list__description--title">
            Description:
          </span>
          <span className="character-list__value">
            {character.species} • {character.status} • {character.gender}
          </span>
        </p>

        <p className="character-list__description">
          <span className="character-list__description--title">Location:</span>
          <span className="character-list__value">
            {character.location.name}
          </span>
        </p>
      </div>

      <img
        className="character-list__image"
        src={character.image}
        alt={character.name}
      />
    </>
  );
}

function CharacterListItem({
  character,
  detailsPath,
  isSelected,
  onToggleSelection,
}: CharacterListItemProps): JSX.Element {
  const content = <CharacterListContent character={character} />;

  return (
    <li className="character-list__item">
      <label className="character-list__checkbox-label">
        <input
          checked={isSelected}
          className="character-list__checkbox"
          type="checkbox"
          aria-label={`Select ${character.name}`}
          onChange={() => {
            onToggleSelection(character.id);
          }}
        />
      </label>

      {detailsPath ? (
        <Link
          className="character-list__link"
          to={detailsPath}
          aria-label={`View details for ${character.name}`}
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}

function CharacterList({
  characters,
  errorMessage,
  isLoading,
  placeholder,
  detailsOutlet,
  getDetailsPath,
  selectedCharacterId,
  selectedCharacterIds,
  onToggleCharacterSelection,
}: CharacterListProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="results-placeholder">
        <p className="loading-text">
          Loading<span className="loading-dots">...</span>
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="results-placeholder results-placeholder--error">
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="results-placeholder">
        <p>{placeholder}</p>
      </div>
    );
  }

  const renderCharacterItem = (character: Character): JSX.Element => (
    <CharacterListItem
      key={character.id}
      character={character}
      detailsPath={getDetailsPath?.(character.id)}
      isSelected={selectedCharacterIds.includes(character.id)}
      onToggleSelection={onToggleCharacterSelection}
    />
  );

  if (detailsOutlet && selectedCharacterId !== null) {
    const selectedCharacterIndex = characters.findIndex(
      (character) => character.id === selectedCharacterId
    );

    if (selectedCharacterIndex !== -1) {
      const charactersBeforeDetails = characters.slice(
        0,
        selectedCharacterIndex + 1
      );
      const charactersAfterDetails = characters.slice(
        selectedCharacterIndex + 1
      );

      return (
        <>
          <ul className="character-list">
            {charactersBeforeDetails.map(renderCharacterItem)}
          </ul>

          <div className="character-list__details">{detailsOutlet}</div>

          {charactersAfterDetails.length > 0 && (
            <ul className="character-list character-list--after-details">
              {charactersAfterDetails.map(renderCharacterItem)}
            </ul>
          )}
        </>
      );
    }
  }

  return (
    <ul className="character-list">{characters.map(renderCharacterItem)}</ul>
  );
}

export default CharacterList;
