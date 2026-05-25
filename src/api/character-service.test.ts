import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchCharacterById, fetchCharacters } from './character-service';
import { mockCharacter } from '../test-utils/mock-character';
import { mockCharacterResponse } from '../test-utils/mock-character-response';

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
      json: () => Promise.resolve(mockCharacterResponse),
    } as Response);

    const result = await fetchCharacters();
    expect(result).toEqual(mockCharacterResponse);
  });

  it('includes page in the request URL', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCharacterResponse),
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
      json: () => Promise.resolve(mockCharacterResponse),
    } as Response);

    await fetchCharacters('Morty', 1);

    const url = vi.mocked(fetch).mock.calls[0][0] as URL;
    expect(url.searchParams.get('name')).toBe('Morty');
  });

  it('passes abort signal to fetch', async () => {
    const controller = new AbortController();

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCharacterResponse),
    } as Response);

    await fetchCharacters('', 1, controller.signal);

    expect(fetch).toHaveBeenCalledWith(expect.any(URL), {
      signal: controller.signal,
    });
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

describe('fetchCharacterById', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns successful character details data', async () => {
    const controller = new AbortController();

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCharacter),
    } as Response);

    const result = await fetchCharacterById('1', controller.signal);

    expect(result).toEqual(mockCharacter);
    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1',
      {
        signal: controller.signal,
      }
    );
  });

  it('throws an error when character details request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const result = fetchCharacterById('1');

    await expect(result).rejects.toThrow(
      'Unable to load character details. Please try again later. Status: 404'
    );
  });
});
