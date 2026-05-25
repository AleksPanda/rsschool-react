import { create } from 'zustand';

import { fetchCharacters } from '../api/character-service';
import type { Character } from '../types';

const CHARACTERS_ERROR_MESSAGE =
  'Unable to load characters. Please try again later.';

interface SearchInputState {
  sourceSearchTerm: string;
  value: string;
}

interface LoadCharactersParams {
  searchTerm: string;
  page: number;
  requestKey: string;
  signal?: AbortSignal;
}

interface CharactersStore {
  characters: Character[];
  totalPages: number;
  errorMessage: string;
  loadedRequestKey: string;
  searchInputState: SearchInputState;

  setSearchInputState: (searchInputState: SearchInputState) => void;
  loadCharacters: (params: LoadCharactersParams) => Promise<void>;
}

export const useCharactersStore = create<CharactersStore>()((set) => ({
  characters: [],
  totalPages: 0,
  errorMessage: '',
  loadedRequestKey: '',
  searchInputState: {
    sourceSearchTerm: '',
    value: '',
  },

  setSearchInputState: (newSearchInputState) => {
    set({ searchInputState: newSearchInputState });
  },

  loadCharacters: async ({ searchTerm, page, requestKey, signal }) => {
    try {
      const data = await fetchCharacters(searchTerm, page, signal);

      if (signal?.aborted) {
        return;
      }

      set({
        characters: data.results,
        totalPages: data.info.pages,
        errorMessage: '',
      });
    } catch {
      if (signal?.aborted) {
        return;
      }

      set({
        characters: [],
        totalPages: 0,
        errorMessage: CHARACTERS_ERROR_MESSAGE,
      });
    } finally {
      if (!signal?.aborted) {
        set({ loadedRequestKey: requestKey });
      }
    }
  },
}));
