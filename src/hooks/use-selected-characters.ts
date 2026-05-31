import { useShallow } from 'zustand/shallow';

import { useSelectedCharactersStore } from '../store/selected-characters-store';

export function useSelectedCharacters() {
  const selectedCharacters = useSelectedCharactersStore(
    (state) => state.selectedCharacters
  );

  const selectedCharacterIds = useSelectedCharactersStore(
    useShallow((state) =>
      state.selectedCharacters.map((character) => character.id)
    )
  );

  const toggleCharacterSelection = useSelectedCharactersStore(
    (state) => state.toggleCharacterSelection
  );

  const clearSelectedCharacters = useSelectedCharactersStore(
    (state) => state.clearSelectedCharacters
  );

  return {
    selectedCharacters,
    selectedCharacterIds,
    toggleCharacterSelection,
    clearSelectedCharacters,
  };
}
