import { afterEach, describe, expect, it } from 'vitest';
import {
  getSavedSearchTerm,
  saveSearchTerm,
  SEARCH_TERM_KEY,
} from './local-storage';

describe('local-storage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('returns an empty string when there is no saved search term', () => {
    expect(getSavedSearchTerm()).toBe('');
  });

  it('returns saved search term from localStorage', () => {
    localStorage.setItem(SEARCH_TERM_KEY, 'Rick');

    expect(getSavedSearchTerm()).toBe('Rick');
  });

  it('saves search term to localStorage', () => {
    saveSearchTerm('Morty');

    expect(localStorage.getItem(SEARCH_TERM_KEY)).toBe('Morty');
  });

  it('overwrites existing search term in localStorage', () => {
    localStorage.setItem(SEARCH_TERM_KEY, 'Rick');

    saveSearchTerm('Summer');

    expect(localStorage.getItem(SEARCH_TERM_KEY)).toBe('Summer');
  });
});
