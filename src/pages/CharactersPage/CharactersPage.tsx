import { useEffect, useState, type JSX } from 'react';
import Header from '../../components/Header';
import SearchPanel from '../../components/SearchPanel';
import CharacterList from '../../components/CharacterList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  createCharacterSearchParams,
  getPageFromSearchParams,
  getSearchTermFromSearchParams,
} from '../../utils/url-search-params';
import Pagination from '../../components/Pagination';
import CharacterDetails from '../../components/CharacterDetails';
import { useMediaQuery } from '../../hooks/use-media-query';
import './CharactersPage.scss';
import { useCharactersStore } from '../../store/characters-store';

function CharactersPage(): JSX.Element {
  // Router hooks
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const currentPage = getPageFromSearchParams(searchParams);
  const appliedSearchTerm = getSearchTermFromSearchParams(searchParams);
  const detailsParam = searchParams.get('details');
  const selectedCharacterNumericId = Number(detailsParam);
  const selectedCharacterId =
    detailsParam &&
    Number.isInteger(selectedCharacterNumericId) &&
    selectedCharacterNumericId > 0
      ? detailsParam
      : null;

  // Zustand state
  const characters = useCharactersStore((state) => state.characters);
  const totalPages = useCharactersStore((state) => state.totalPages);
  const errorMessage = useCharactersStore((state) => state.errorMessage);
  const loadedRequestKey = useCharactersStore(
    (state) => state.loadedRequestKey
  );
  const searchInputState = useCharactersStore(
    (state) => state.searchInputState
  );
  const selectedCharacterIds = useCharactersStore(
    (state) => state.selectedCharacterIds
  );

  // Zustand actions
  const loadCharacters = useCharactersStore((state) => state.loadCharacters);
  const setSearchInputState = useCharactersStore(
    (state) => state.setSearchInputState
  );
  const toggleCharacterSelection = useCharactersStore(
    (state) => state.toggleCharacterSelection
  );

  // Local state and other hooks
  const [hasTestError, setHasTestError] = useState(false);
  const isMobileDetailsLayout = useMediaQuery('(max-width: 850px)');

  // Calculated values
  // помогает понять, какой именно запрос уже загружен
  const currentRequestKey = `${currentPage}:${appliedSearchTerm}`;
  const isLoading = loadedRequestKey !== currentRequestKey;
  const visibleErrorMessage = isLoading ? '' : errorMessage;

  const isInputSyncedWithCurrentUrl =
    searchInputState.sourceSearchTerm === appliedSearchTerm;

  const searchInput = isInputSyncedWithCurrentUrl
    ? searchInputState.value
    : appliedSearchTerm;

  const hasDetails = Boolean(selectedCharacterId);

  const hasInlineDetails =
    isMobileDetailsLayout &&
    selectedCharacterId !== null &&
    characters.some(
      (character) => String(character.id) === selectedCharacterId
    );

  // Effects
  useEffect(() => {
    const controller = new AbortController();

    void loadCharacters({
      searchTerm: appliedSearchTerm,
      page: currentPage,
      requestKey: currentRequestKey,
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [appliedSearchTerm, currentPage, currentRequestKey, loadCharacters]);

  useEffect(() => {
    if (searchParams.has('page')) {
      return;
    }

    setSearchParams(createCharacterSearchParams(1, appliedSearchTerm), {
      replace: true,
    });
  }, [appliedSearchTerm, searchParams, setSearchParams]);

  // Handlers
  const handleCloseDetails = (): void => {
    const params = new URLSearchParams(searchParams);

    params.delete('details');
    setSearchParams(params);
  };

  const handleSearch = (): void => {
    const searchTerm = searchInput.trim();

    setSearchInputState({
      sourceSearchTerm: searchTerm,
      value: searchTerm,
    });

    if (searchTerm === appliedSearchTerm && currentPage === 1) {
      return;
    }

    const params = createCharacterSearchParams(1, searchTerm);

    navigate({
      pathname: '/',
      search: `?${params.toString()}`,
    });
  };

  const handleSearchInputChange = (value: string): void => {
    setSearchInputState({
      sourceSearchTerm: appliedSearchTerm,
      value,
    });
  };

  const handlePageChange = (page: number): void => {
    if (page === currentPage || page < 1 || page > totalPages) {
      return;
    }

    setSearchParams(createCharacterSearchParams(page, appliedSearchTerm));
  };

  const getDetailsPath = (characterId: number): string => {
    const params = new URLSearchParams(searchParams);

    params.set('details', String(characterId));

    return `/?${params.toString()}`;
  };

  const triggerTestError = (): void => {
    setHasTestError(true);
  };

  // Render helpers
  const detailsPanel = selectedCharacterId ? (
    <CharacterDetails
      characterId={selectedCharacterId}
      onClose={handleCloseDetails}
    />
  ) : null;

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
        <div
          className={
            hasDetails
              ? 'results-layout results-layout--with-details'
              : 'results-layout'
          }
        >
          <div className="results-layout__list">
            <CharacterList
              characters={characters}
              errorMessage={visibleErrorMessage}
              isLoading={isLoading}
              placeholder="Results will appear here."
              detailsOutlet={hasInlineDetails ? detailsPanel : null}
              selectedCharacterId={selectedCharacterNumericId}
              selectedCharacterIds={selectedCharacterIds}
              onToggleCharacterSelection={toggleCharacterSelection}
              getDetailsPath={getDetailsPath}
            />

            {!isLoading && !visibleErrorMessage && characters.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
          {hasDetails && !hasInlineDetails && (
            <aside className="results-layout__details">{detailsPanel}</aside>
          )}
        </div>
      </section>
    </>
  );
}

export default CharactersPage;
