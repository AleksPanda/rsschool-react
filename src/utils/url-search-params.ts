export function getPageFromSearchParams(searchParams: URLSearchParams): number {
  const pageParam = Number(searchParams.get('page'));

  return Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
}

export function createCharacterSearchParams(
  page: number,
  search = ''
): URLSearchParams {
  const params = new URLSearchParams();

  params.set('page', String(page));

  if (search) {
    params.set('search', search);
  }

  return params;
}
