// src/store/selected-characters-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Character } from '../types';

interface SelectedCharactersStore {
  selectedCharacters: Character[];
  toggleCharacterSelection: (character: Character) => void;
  clearSelectedCharacters: () => void;
}

export const useSelectedCharactersStore = create<SelectedCharactersStore>()(
  persist(
    (set) => ({
      selectedCharacters: [],

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
    }),
    {
      name: 'selected-characters-store',
    }
  )
);
