import { useEffect, useState } from 'react';

import { fetchCharacters } from '../api/character-service';
import type { Character } from '../types';

const CHARACTERS_ERROR_MESSAGE =
  'Unable to load characters. Please try again later.';

interface UseCharactersResult {
  characters: Character[];
  totalPages: number;
  errorMessage: string;
  isLoading: boolean;
}

export function useCharacters(
  searchTerm: string,
  page: number
): UseCharactersResult {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadedRequestKey, setLoadedRequestKey] = useState('');

  const currentRequestKey = `${page}:${searchTerm}`;
  const isLoading = loadedRequestKey !== currentRequestKey;

  useEffect(() => {
    const controller = new AbortController();

    async function loadCharacters(): Promise<void> {
      try {
        const data = await fetchCharacters(searchTerm, page, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setCharacters(data.results);
        setTotalPages(data.info.pages);
        setErrorMessage('');
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setCharacters([]);
        setTotalPages(0);
        setErrorMessage(CHARACTERS_ERROR_MESSAGE);
      } finally {
        if (!controller.signal.aborted) {
          setLoadedRequestKey(currentRequestKey);
        }
      }
    }

    void loadCharacters();

    return () => {
      controller.abort();
    };
  }, [searchTerm, page, currentRequestKey]);

  return {
    characters,
    totalPages,
    errorMessage,
    isLoading,
  };
}
