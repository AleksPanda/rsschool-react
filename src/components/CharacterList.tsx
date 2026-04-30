import type { JSX } from 'react';
import type { Character } from '../types';

interface CharacterListProps {
  characters: Character[];
  placeholder: string;
}

function CharacterList({
  characters,
  placeholder,
}: CharacterListProps): JSX.Element {
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
        </li>
      ))}
    </ul>
  );
}

export default CharacterList;
