import { beforeEach, describe, expect, it } from 'vitest';
import { mockCharacter } from '../test-utils/mock-character';

import { useSelectedCharactersStore } from './selected-characters-store';

describe('useSelectedCharactersStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useSelectedCharactersStore.setState({
      selectedCharacters: [],
    });
  });

  it('selects and unselects character', () => {
    useSelectedCharactersStore
      .getState()
      .toggleCharacterSelection(mockCharacter);

    expect(useSelectedCharactersStore.getState().selectedCharacters).toEqual([
      mockCharacter,
    ]);

    useSelectedCharactersStore
      .getState()
      .toggleCharacterSelection(mockCharacter);

    expect(useSelectedCharactersStore.getState().selectedCharacters).toEqual(
      []
    );
  });

  it('clears selected characters', () => {
    useSelectedCharactersStore.setState({
      selectedCharacters: [mockCharacter],
    });

    useSelectedCharactersStore.getState().clearSelectedCharacters();

    expect(useSelectedCharactersStore.getState().selectedCharacters).toEqual(
      []
    );
  });
});
