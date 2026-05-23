import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  selectedCharacterIds: number[];

  setSearchInputState: (searchInputState: SearchInputState) => void;
  toggleCharacterSelection: (characterId: number) => void;
  clearSelectedCharacters: () => void;
  loadCharacters: (params: LoadCharactersParams) => Promise<void>;
}

export const useCharactersStore = create<CharactersStore>()(
  persist(
    (set) => ({
      characters: [],
      totalPages: 0,
      errorMessage: '',
      loadedRequestKey: '',
      searchInputState: {
        sourceSearchTerm: '',
        value: '',
      },
      selectedCharacterIds: [],

      setSearchInputState: (newSearchInputState) => {
        set({ searchInputState: newSearchInputState });
      },

      toggleCharacterSelection: (characterId) => {
        set((state) => {
          const isSelected = state.selectedCharacterIds.includes(characterId);

          return {
            selectedCharacterIds: isSelected
              ? state.selectedCharacterIds.filter((id) => id !== characterId)
              : [...state.selectedCharacterIds, characterId],
          };
        });
      },

      clearSelectedCharacters: () => {
        set({ selectedCharacterIds: [] });
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
    }),
    {
      name: 'characters-store',
      partialize: (state) => ({
        selectedCharacterIds: state.selectedCharacterIds,
      }),
    }
  )
);
