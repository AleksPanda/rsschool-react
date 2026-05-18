import { useEffect, useState, type JSX } from 'react';
import { useLocalStorage } from '../hooks/use-local-storage';
import { SEARCH_TERM_KEY } from '../utils/local-storage';
import type { Character } from '../types';
import { fetchCharacters } from '../api/character-service';
import Header from '../components/Header';
import SearchPanel from '../components/SearchPanel';
import CharacterList from '../components/CharacterList';
import { useSearchParams } from 'react-router-dom';
import {
  createCharacterSearchParams,
  getPageFromSearchParams,
} from '../utils/url-search-params';
import Pagination from '../components/Pagination';

function CharactersPage(): JSX.Element {
  const [savedSearchTerm, saveSearchTerm] = useLocalStorage(
    SEARCH_TERM_KEY,
    ''
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = getPageFromSearchParams(searchParams);
  const appliedSearchTerm = searchParams.get('search') ?? savedSearchTerm;

  const [searchInput, setSearchInput] = useState(appliedSearchTerm);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasTestError, setHasTestError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const currentRequestKey = `${currentPage}:${appliedSearchTerm}`;
  const [loadedRequestKey, setLoadedRequestKey] = useState('');
  const isLoading = loadedRequestKey !== currentRequestKey;
  const visibleErrorMessage = isLoading ? '' : errorMessage;

  useEffect(() => {
    const controller = new AbortController();

    async function loadCharacters(): Promise<void> {
      try {
        const data = await fetchCharacters(
          appliedSearchTerm,
          currentPage,
          controller.signal
        );

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
        setErrorMessage('Unable to load characters. Please try again later.');
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
  }, [appliedSearchTerm, currentPage, currentRequestKey]);

  useEffect(() => {
    if (searchParams.has('page')) {
      return;
    }

    setSearchParams(createCharacterSearchParams(1, appliedSearchTerm), {
      replace: true,
    });
  }, [appliedSearchTerm, searchParams, setSearchParams]);

  const handleSearch = (): void => {
    const searchTerm = searchInput.trim();

    if (searchTerm === appliedSearchTerm && currentPage === 1) {
      setSearchInput(searchTerm);
      return;
    }

    saveSearchTerm(searchTerm);
    setSearchInput(searchTerm);

    setSearchParams(createCharacterSearchParams(1, searchTerm));
  };

  const handleSearchInputChange = (value: string): void => {
    setSearchInput(value);
  };

  const handlePageChange = (page: number): void => {
    if (page === currentPage || page < 1 || page > totalPages) {
      return;
    }

    setSearchParams(createCharacterSearchParams(page, appliedSearchTerm));
  };

  const triggerTestError = (): void => {
    setHasTestError(true);
  };

  if (hasTestError) {
    throw new Error('Test error boundary error');
  }

  return (
    <>
      <Header triggerTestError={triggerTestError} />

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
          errorMessage={visibleErrorMessage}
          isLoading={isLoading}
          placeholder="Results will appear here."
        />

        {!isLoading && !visibleErrorMessage && characters.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </>
  );
}

export default CharactersPage;
