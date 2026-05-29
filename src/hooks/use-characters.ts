import { fetchCharacters } from '../api/character-service';
import type { Character } from '../types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { characterQueryKeys } from '../api/query-keys';

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
  const { data, error, isPending, isFetching, isPlaceholderData } = useQuery({
    queryFn: ({ signal }) => fetchCharacters(searchTerm, page, signal),
    queryKey: characterQueryKeys.list(searchTerm, page),
    placeholderData: keepPreviousData,
  });

  return {
    characters: data?.results ?? [],
    totalPages: data?.info.pages ?? 0,
    errorMessage: error ? CHARACTERS_ERROR_MESSAGE : '',
    isLoading: isPending || (isFetching && isPlaceholderData),
  };
}
