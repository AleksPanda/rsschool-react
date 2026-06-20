import Image from 'next/image';
import type { JSX } from 'react';

import { Link } from '../../i18n/navigation';
import type { Character } from '../../types';
import CharacterSelectionCheckbox from './CharacterSelectionCheckbox';

interface CharacterCardProps {
  character: Character;
  detailsHref: string;
  nameLabel: string;
  descriptionLabel: string;
  locationLabel: string;
  viewDetailsLabel: string;
}

function CharacterCard({
  character,
  detailsHref,
  nameLabel,
  descriptionLabel,
  locationLabel,
  viewDetailsLabel,
}: CharacterCardProps): JSX.Element {
  return (
    <li className="character-list__item">
      <CharacterSelectionCheckbox character={character} />

      <Link
        className="character-list__link"
        href={detailsHref}
        aria-label={viewDetailsLabel}
      >
        <div className="character-list__content">
          <h3 className="character-list__name">
            <span className="character-list__name--title">{nameLabel}</span>
            <span className="character-list__value">{character.name}</span>
          </h3>

          <p className="character-list__description">
            <span className="character-list__description--title">
              {descriptionLabel}
            </span>
            <span className="character-list__value">
              {character.species} · {character.status} · {character.gender}
            </span>
          </p>

          <p className="character-list__description">
            <span className="character-list__description--title">
              {locationLabel}
            </span>
            <span className="character-list__value">
              {character.location.name}
            </span>
          </p>
        </div>

        <Image
          className="character-list__image"
          src={character.image}
          alt={character.name}
          width={96}
          height={96}
        />
      </Link>
    </li>
  );
}

export default CharacterCard;
