import { getTranslations } from 'next-intl/server';
import type { JSX } from 'react';

import CharacterCard from '../CharacterCard';
import type { Character } from '../../types';
import './CharacterList.scss';

interface ServerCharacterListProps {
  characters: Character[];
  currentPage: number;
  searchTerm: string;
}

function createDetailsHref(
  characterId: number,
  currentPage: number,
  searchTerm: string
): string {
  const params = new URLSearchParams({
    page: String(currentPage),
    details: String(characterId),
  });

  if (searchTerm) {
    params.set('search', searchTerm);
  }

  return `/?${params.toString()}`;
}

export default async function ServerCharacterList({
  characters,
  currentPage,
  searchTerm,
}: ServerCharacterListProps): Promise<JSX.Element> {
  const t = await getTranslations('CharacterCard');

  return (
    <ul className="character-list">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          detailsHref={createDetailsHref(character.id, currentPage, searchTerm)}
          nameLabel={t('name')}
          descriptionLabel={t('description')}
          locationLabel={t('location')}
          viewDetailsLabel={t('viewDetails', { name: character.name })}
        />
      ))}
    </ul>
  );
}
