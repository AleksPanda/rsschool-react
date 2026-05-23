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
  selectedCharacters: Character[];

  setSearchInputState: (searchInputState: SearchInputState) => void;
  toggleCharacterSelection: (character: Character) => void;
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
      selectedCharacters: [],

      setSearchInputState: (newSearchInputState) => {
        set({ searchInputState: newSearchInputState });
      },

      toggleCharacterSelection: (character) => {
        set((state) => {
          const isSelected = state.selectedCharacters.some(
            (selectedCharacter) => selectedCharacter.id === character.id
          );

          return {
            selectedCharacters: isSelected
              ? state.selectedCharacters.filter(
                  (selectedCharacter) => selectedCharacter.id !== character.id
                )
              : [...state.selectedCharacters, character],
          };
        });
      },

      clearSelectedCharacters: () => {
        set({ selectedCharacters: [] });
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
        selectedCharacters: state.selectedCharacters,
      }),
    }
  )
);
