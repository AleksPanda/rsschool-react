import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchCharacters } from './character-service';

const characterResponse = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: {
        name: 'Earth (C-137)',
        url: 'https://rickandmortyapi.com/api/location/1',
      },
      location: {
        name: 'Citadel of Ricks',
        url: 'https://rickandmortyapi.com/api/location/3',
      },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    },
  ],
};

describe('fetchCharacters', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns successful API response data', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(characterResponse),
    } as Response);

    const result = await fetchCharacters();
    expect(result).toEqual(characterResponse);
  });

  it('includes page in the request URL', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(characterResponse),
    } as Response);

    await fetchCharacters('', 3);
    expect(fetch).toHaveBeenCalledTimes(1);

    const firstFetchCall = vi.mocked(fetch).mock.calls[0];
    const firstFetchArgument = firstFetchCall[0];
    const url = firstFetchArgument as URL;

    const pageParam = url.searchParams.get('page');

    expect(pageParam).toBe('3');
  });

  it('includes name in the request URL when search term is provided', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(characterResponse),
    } as Response);

    await fetchCharacters('Morty', 1);

    const url = vi.mocked(fetch).mock.calls[0][0] as URL;
    expect(url.searchParams.get('name')).toBe('Morty');
  });

  it.each([404, 500])(
    'throws an error for failed %s responses',
    async (status) => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status,
      } as Response);

      const result = fetchCharacters();
      await expect(result).rejects.toThrow(
        `Unable to load characters. Please try again later. Status: ${status}`
      );
    }
  );
});
