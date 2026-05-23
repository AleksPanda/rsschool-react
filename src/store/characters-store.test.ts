import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCharacters } from '../api/character-service';
import { mockCharacter } from '../test-utils/mock-character';
import { mockCharacterResponse } from '../test-utils/mock-character-response';
import { useCharactersStore } from './characters-store';

vi.mock('../api/character-service', () => ({
  fetchCharacters: vi.fn(),
}));

describe('useCharactersStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useCharactersStore.setState({
      characters: [],
      totalPages: 0,
      errorMessage: '',
      loadedRequestKey: '',
      searchInputState: {
        sourceSearchTerm: '',
        value: '',
      },
    });
  });

  it('setSearchInputState updates search input state', () => {
    const searchInputState = {
      sourceSearchTerm: 'Rick',
      value: 'Morty',
    };

    useCharactersStore.getState().setSearchInputState(searchInputState);

    expect(useCharactersStore.getState().searchInputState).toEqual(
      searchInputState
    );
  });

  it('loadCharacters saves characters after successful request', async () => {
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharacterResponse);

    await useCharactersStore.getState().loadCharacters({
      searchTerm: 'Rick',
      page: 2,
      requestKey: 'Rick-2',
    });

    expect(fetchCharacters).toHaveBeenCalledWith('Rick', 2, undefined);
    expect(useCharactersStore.getState()).toMatchObject({
      characters: [mockCharacter],
      totalPages: 1,
      errorMessage: '',
      loadedRequestKey: 'Rick-2',
    });
  });

  it('loadCharacters clears data and sets error message after failed request', async () => {
    useCharactersStore.setState({
      characters: [mockCharacter],
      totalPages: 3,
    });

    vi.mocked(fetchCharacters).mockRejectedValue(new Error('Failed request'));

    await useCharactersStore.getState().loadCharacters({
      searchTerm: 'Rick',
      page: 1,
      requestKey: 'Rick-1',
    });

    expect(useCharactersStore.getState()).toMatchObject({
      characters: [],
      totalPages: 0,
      errorMessage: 'Unable to load characters. Please try again later.',
      loadedRequestKey: 'Rick-1',
    });
  });

  it('loadCharacters does not update state when request is aborted', async () => {
    const controller = new AbortController();

    useCharactersStore.setState({
      characters: [mockCharacter],
      totalPages: 3,
      errorMessage: '',
      loadedRequestKey: 'previous-request',
    });

    vi.mocked(fetchCharacters).mockImplementation(async () => {
      controller.abort();
      throw new Error('Request aborted');
    });

    await useCharactersStore.getState().loadCharacters({
      searchTerm: 'Rick',
      page: 1,
      requestKey: 'aborted-request',
      signal: controller.signal,
    });

    expect(useCharactersStore.getState()).toMatchObject({
      characters: [mockCharacter],
      totalPages: 3,
      errorMessage: '',
      loadedRequestKey: 'previous-request',
    });
  });
});
