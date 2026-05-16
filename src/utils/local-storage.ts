export const SEARCH_TERM_KEY = 'rick-and-morty-search-term';

export function getSavedSearchTerm(): string {
  return localStorage.getItem(SEARCH_TERM_KEY) ?? '';
}

export function saveSearchTerm(searchTerm: string): void {
  localStorage.setItem(SEARCH_TERM_KEY, searchTerm);
}
