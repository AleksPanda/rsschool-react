import { useCallback, useEffect, useState, type JSX } from 'react';
import { useLocalStorage } from '../hooks/use-local-storage';
import { SEARCH_TERM_KEY } from '../utils/local-storage';
import type { Character } from '../types';
import { fetchCharacters } from '../api/character-service';
import Header from '../components/Header';
import SearchPanel from '../components/SearchPanel';
import CharacterList from '../components/CharacterList';

function SearchPage(): JSX.Element {
  const [savedSearchTerm, saveSearchTerm] = useLocalStorage(
    SEARCH_TERM_KEY,
    ''
  );

  const [searchInput, setSearchInput] = useState(savedSearchTerm);
  const [lastSearchTerm, setLastSearchTerm] = useState(savedSearchTerm);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasTestError, setHasTestError] = useState(false);

  const loadCharacters = useCallback(
    async (searchTerm: string, page = 1): Promise<void> => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchCharacters(searchTerm, page);

        setCharacters(data.results);
      } catch {
        setCharacters([]);
        setErrorMessage('Unable to load characters. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialCharacters(): Promise<void> {
      try {
        const data = await fetchCharacters(
          savedSearchTerm,
          1,
          controller.signal
        );

        if (controller.signal.aborted) {
          return;
        }

        setCharacters(data.results);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setCharacters([]);
        setErrorMessage('Unable to load characters. Please try again later.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialCharacters();

    return () => {
      controller.abort();
    };
  }, [savedSearchTerm]);

  const handleSearchInputChange = (value: string): void => {
    setSearchInput(value);
  };

  const handleSearch = async (): Promise<void> => {
    const searchTerm = searchInput.trim();

    if (searchTerm === lastSearchTerm) {
      setSearchInput(searchTerm);
      return;
    }

    saveSearchTerm(searchTerm);
    setSearchInput(searchTerm);
    setLastSearchTerm(searchTerm);

    await loadCharacters(searchTerm);
  };

  const triggerTestError = (): void => {
    setHasTestError(true);
  };

  if (hasTestError) {
    throw new Error('Test error boundary error');
  }

  return (
    <main className="app">
      <section className="app__section">
        <Header triggerTestError={triggerTestError} />
      </section>

      <section className="app__section">
        <SearchPanel
          value={searchInput}
          onInputChange={handleSearchInputChange}
          onSearch={handleSearch}
        />
      </section>

      <section className="app__section">
        <h2 className="app__section-title">Results</h2>

        <CharacterList
          characters={characters}
          errorMessage={errorMessage}
          isLoading={isLoading}
          placeholder="Results will appear here."
        />
      </section>
    </main>
  );
}

export default SearchPage;
