import type { Character, CharacterResponse } from '../types';

const API_URL = 'https://rickandmortyapi.com/api/character';

export async function fetchCharacters(
  searchTerm = '',
  page = 1,
  signal?: AbortSignal
): Promise<CharacterResponse> {
  const url = new URL(API_URL);

  url.searchParams.set('page', String(page));

  if (searchTerm) {
    url.searchParams.set('name', searchTerm);
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(
      `Unable to load characters. Please try again later. Status: ${response.status}`
    );
  }

  return response.json() as Promise<CharacterResponse>;
}

export async function fetchCharacterById(
  characterId: string,
  signal?: AbortSignal
): Promise<Character> {
  const response = await fetch(`${API_URL}/${characterId}`, { signal });

  if (!response.ok) {
    throw new Error(
      `Unable to load character details. Please try again later. Status: ${response.status}`
    );
  }

  return response.json() as Promise<Character>;
}
