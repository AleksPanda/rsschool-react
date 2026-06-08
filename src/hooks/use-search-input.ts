import { useState } from 'react';

interface SearchInputState {
  sourceSearchTerm: string;
  value: string;
}

export function useSearchInput(
  appliedSearchTerm: string,
  onSearchSubmit: (searchTerm: string) => void
) {
  const [searchInputState, setSearchInputState] = useState<SearchInputState>({
    sourceSearchTerm: appliedSearchTerm,
    value: appliedSearchTerm,
  });

  const isInputSyncedWithCurrentUrl =
    searchInputState.sourceSearchTerm === appliedSearchTerm;

  const searchInput = isInputSyncedWithCurrentUrl
    ? searchInputState.value
    : appliedSearchTerm;

  const handleSearch = (): void => {
    const searchTerm = searchInput.trim();

    setSearchInputState({
      sourceSearchTerm: searchTerm,
      value: searchTerm,
    });

    onSearchSubmit(searchTerm);
  };

  const handleSearchInputChange = (value: string): void => {
    setSearchInputState({
      sourceSearchTerm: appliedSearchTerm,
      value,
    });
  };

  return {
    searchInput,
    handleSearch,
    handleSearchInputChange,
  };
}
