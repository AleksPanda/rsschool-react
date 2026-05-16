import { useEffect, useState, type JSX } from 'react';
import Header from './components/Header';
import SearchPanel from './components/SearchPanel';
import CharacterList from './components/CharacterList';
import { fetchCharacters } from './api/character-service';
import { useLocalStorage } from './hooks/use-local-storage';
import { SEARCH_TERM_KEY } from './utils/local-storage';
import type { Character } from './types';

function App(): JSX.Element {
  const [lastSearchTerm, saveSearchTerm] = useLocalStorage(SEARCH_TERM_KEY, '');

  const [searchInput, setSearchInput] = useState(lastSearchTerm);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasTestError, setHasTestError] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadCharacters(): Promise<void> {
      try {
        const data = await fetchCharacters(lastSearchTerm, 1);

        if (!isActive) {
          return;
        }

        setCharacters(data.results);
      } catch {
        if (!isActive) {
          return;
        }

        setCharacters([]);
        setErrorMessage('Unable to load characters. Please try again later.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCharacters();

    return () => {
      isActive = false;
    };
  }, [lastSearchTerm]);

  const handleSearchInputChange = (value: string): void => {
    setSearchInput(value);
  };

  const handleSearch = (): void => {
    const searchTerm = searchInput.trim();

    if (searchTerm === lastSearchTerm) {
      setSearchInput(searchTerm);
      return;
    }

    setSearchInput(searchTerm);
    setErrorMessage('');
    setIsLoading(true);
    saveSearchTerm(searchTerm);
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

export default App;
