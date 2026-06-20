import { describe, expect, it } from 'vitest';

import { getCharacterId, getPage, getSearchTerm } from './search-params';

describe('search params', () => {
  it('returns a valid page or defaults to the first page', () => {
    expect(getPage({ page: '3' })).toBe(3);
    expect(getPage({ page: '-1' })).toBe(1);
    expect(getPage({ page: 'invalid' })).toBe(1);
  });

  it('reads and trims the search term', () => {
    expect(getSearchTerm({ search: '  Rick  ' })).toBe('Rick');
    expect(getSearchTerm({})).toBe('');
  });

  it('returns only a positive integer character id', () => {
    expect(getCharacterId({ details: '42' })).toBe('42');
    expect(getCharacterId({ details: '0' })).toBeNull();
    expect(getCharacterId({ details: 'invalid' })).toBeNull();
  });
});
