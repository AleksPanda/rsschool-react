import { fetchCharacters } from '../services/character-service';
import type { Character } from '../types';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { characterQueryKeys } from '../api/query-keys';

const CHARACTERS_ERROR_MESSAGE =
  'Unable to load characters. Please try again later.';

interface UseCharactersResult {
  characters: Character[];
  totalPages: number;
  errorMessage: string;
  isLoading: boolean;
  isRefreshing: boolean;
  refreshCharacters: () => void;
}

export function useCharacters(
  searchTerm: string,
  page: number
): UseCharactersResult {
  const queryClient = useQueryClient();
  const queryKey = characterQueryKeys.list(searchTerm, page);

  const { data, error, isPending, isFetching, isPlaceholderData } = useQuery({
    queryFn: ({ signal }) => fetchCharacters(searchTerm, page, signal),
    queryKey,
    placeholderData: keepPreviousData,
  });

  const refreshCharacters = (): void => {
    void queryClient.invalidateQueries({
      queryKey,
    });
  };

  return {
    characters: data?.results ?? [],
    totalPages: data?.info.pages ?? 0,
    errorMessage: error ? CHARACTERS_ERROR_MESSAGE : '',
    isLoading: isPending || (isFetching && isPlaceholderData),
    isRefreshing: isFetching && !isPending && !isPlaceholderData,
    refreshCharacters,
  };
}
