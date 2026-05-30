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
import SelectedItemsFlyout from '../../components/SelectedItemsFlyout/SelectedItemsFlyout';
import { downloadSelectedCharactersCsv } from '../../utils/download-selected-characters';
import { useSelectedCharactersStore } from '../../store/selected-characters-store';
import { useCharacters } from '../../hooks/use-characters';
import { useQueryClient } from '@tanstack/react-query';
import { characterQueryKeys } from '../../api/query-keys';

interface SearchInputState {
  sourceSearchTerm: string;
  value: string;
}

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
  const selectedCharacters = useSelectedCharactersStore(
    (state) => state.selectedCharacters
  );
  const selectedCharacterIds = selectedCharacters.map(
    (character) => character.id
  );

  // Zustand actions
  const toggleCharacterSelection = useSelectedCharactersStore(
    (state) => state.toggleCharacterSelection
  );
  const clearSelectedCharacters = useSelectedCharactersStore(
    (state) => state.clearSelectedCharacters
  );

  // Local state and other hooks
  const { characters, totalPages, errorMessage, isLoading } = useCharacters(
    appliedSearchTerm,
    currentPage
  );

  const [searchInputState, setSearchInputState] = useState<SearchInputState>({
    sourceSearchTerm: appliedSearchTerm,
    value: appliedSearchTerm,
  });
  const [hasTestError, setHasTestError] = useState(false);
  const isMobileDetailsLayout = useMediaQuery('(max-width: 850px)');
  const queryClient = useQueryClient();

  // Calculated values
  const visibleErrorMessage = isLoading ? '' : errorMessage;
  const hasCharacters = characters.length > 0;
  const showPagination = !visibleErrorMessage && hasCharacters;

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

  const handleDownloadSelected = (): void => {
    downloadSelectedCharactersCsv(selectedCharacters);
  };

  const handleRefreshResults = (): void => {
    void queryClient.invalidateQueries({
      queryKey: characterQueryKeys.list(appliedSearchTerm, currentPage),
    });
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
        <div className="app__section-header">
          <h2 className="app__section-title">Results</h2>

          <button
            className="pagination__button results-layout__refresh-button"
            type="button"
            onClick={handleRefreshResults}
          >
            Refresh results
          </button>
        </div>

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

            <SelectedItemsFlyout
              selectedCount={selectedCharacters.length}
              onUnselectAll={clearSelectedCharacters}
              onDownload={handleDownloadSelected}
            />

            {showPagination && (
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
