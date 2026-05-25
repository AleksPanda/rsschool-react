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

  if (/[",\n\r]/.test(escapedValue)) {
    return `"${escapedValue}"`;
  }

  return escapedValue;
}

function createCharacterDescription(character: Character): string {
  const characterType = character.type ? `${character.type} ` : '';

  return `${character.name} is a ${characterType.toLowerCase()}${character.species.toLowerCase()} character.`;
}

function getDefaultPageForCharacter(characterId: number): number {
  return Math.max(
    1,
    Math.ceil(characterId / RICK_AND_MORTY_CHARACTERS_PER_PAGE)
  );
}

function createCharacterDetailsUrl(characterId: number): string {
  const detailsUrl = new URL('/', window.location.origin);
  const defaultPage = getDefaultPageForCharacter(characterId);

  detailsUrl.searchParams.set('page', String(defaultPage));
  detailsUrl.searchParams.set('details', String(characterId));

  return detailsUrl.toString();
}

export function createSelectedCharactersCsv(characters: Character[]): string {
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
    createCharacterDetailsUrl(character.id),
  ]);

  return [CSV_HEADERS, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');
}

export function downloadSelectedCharactersCsv(characters: Character[]): void {
  if (characters.length === 0) {
    return;
  }

  const csvContent = createSelectedCharactersCsv(characters);
  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = url;
  downloadLink.download = `${characters.length}_items.csv`;

  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  URL.revokeObjectURL(url);
}
