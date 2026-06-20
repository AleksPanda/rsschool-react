type SearchParamValue = string | string[] | undefined;

export interface CharacterSearchParams {
  page?: SearchParamValue;
  search?: SearchParamValue;
  details?: SearchParamValue;
}

function getSingleValue(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export function getPage(searchParams: CharacterSearchParams): number {
  const page = Number(getSingleValue(searchParams.page));

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function getSearchTerm(searchParams: CharacterSearchParams): string {
  return getSingleValue(searchParams.search).trim();
}

export function getCharacterId(
  searchParams: CharacterSearchParams
): string | null {
  const characterId = getSingleValue(searchParams.details);
  const numericId = Number(characterId);

  return Number.isInteger(numericId) && numericId > 0 ? characterId : null;
}
