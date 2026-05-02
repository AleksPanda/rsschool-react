import type { JSX } from 'react';
import type { Character } from '../types';

interface CharacterListProps {
  characters: Character[];
  errorMessage: string;
  isLoading: boolean;
  placeholder: string;
}

function CharacterList({
  characters,
  errorMessage,
  isLoading,
  placeholder,
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

  return (
    <ul className="character-list">
      {characters.map((character) => (
        <li className="character-list__item" key={character.id}>
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
              <span className="character-list__description--title">
                Location:
              </span>
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
        </li>
      ))}
    </ul>
  );
}

export default CharacterList;
