import type { CharacterResponse } from '../types';
import { mockCharacter } from './mock-character';

export const mockCharacterResponse: CharacterResponse = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [mockCharacter],
};
