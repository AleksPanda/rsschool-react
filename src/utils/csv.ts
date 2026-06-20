import { RICK_AND_MORTY_CHARACTERS_PER_PAGE } from '../constants/api';
import type { Character } from '../types';

const CSV_HEADERS = [
  'id',
  'name',
  'description',
  'status',
  'species',
  'type',
  'gender',
  'origin',
  'location',
  'episodesCount',
  'imageUrl',
  'detailsUrl',
];

function escapeCsvValue(value: string | number | null | undefined): string {
  const stringValue =
    value === null || value === undefined ? '' : String(value);
  const escapedValue = stringValue.replaceAll('"', '""');

  return /[",\n\r]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
}

function createCharacterDescription(character: Character): string {
  const characterType = character.type ? `${character.type} ` : '';

  return `${character.name} is a ${characterType.toLowerCase()}${character.species.toLowerCase()} character.`;
}

function createDetailsUrl(characterId: number, origin: string): string {
  const detailsUrl = new URL('/', origin);
  const page = Math.max(
    1,
    Math.ceil(characterId / RICK_AND_MORTY_CHARACTERS_PER_PAGE)
  );

  detailsUrl.searchParams.set('page', String(page));
  detailsUrl.searchParams.set('details', String(characterId));

  return detailsUrl.toString();
}

export function createCharactersCsv(
  characters: Character[],
  origin: string
): string {
  const rows = characters.map((character) => [
    character.id,
    character.name,
    createCharacterDescription(character),
    character.status,
    character.species,
    character.type,
    character.gender,
    character.origin.name,
    character.location.name,
    character.episode?.length ?? 0,
    character.image,
    createDetailsUrl(character.id, origin),
  ]);

  return [CSV_HEADERS, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');
}
