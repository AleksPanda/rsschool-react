import { useState, type JSX } from 'react';

import Header from '../../components/Header';
import SearchPanel from '../../components/SearchPanel';
import CharacterList from '../../components/CharacterList';
import Pagination from '../../components/Pagination';
import CharacterDetails from '../../components/CharacterDetails';
import SelectedItemsFlyout from '../../components/SelectedItemsFlyout/SelectedItemsFlyout';

import { useCharacters } from '../../hooks/use-characters';
import { useCharacterUrlState } from '../../hooks/use-character-url-state';
import { useMediaQuery } from '../../hooks/use-media-query';
import { useSearchInput } from '../../hooks/use-search-input';
import { useSelectedCharacters } from '../../hooks/use-selected-characters';
import { downloadSelectedCharactersCsv } from '../../utils/download-selected-characters';

import './CharactersPage.scss';

function CharactersPage(): JSX.Element {
  // URL state
  const {
    currentPage,
    appliedSearchTerm,
    selectedCharacterId,
    selectedCharacterNumericId,
    hasDetails,
    applySearch,
    closeDetails,
    changePage,
    getDetailsPath,
  } = useCharacterUrlState();

  // Selected characters state
  const {
    selectedCharacters,
    selectedCharacterIds,
    toggleCharacterSelection,
    clearSelectedCharacters,
  } = useSelectedCharacters();

  // Server state
  const {
    characters,
    totalPages,
    errorMessage,
    isLoading,
    isRefreshing,
    refreshCharacters,
  } = useCharacters(appliedSearchTerm, currentPage);

  // Search input state
  const { searchInput, handleSearch, handleSearchInputChange } = useSearchInput(
    appliedSearchTerm,
    applySearch
  );

  // Local UI state
  const [hasTestError, setHasTestError] = useState(false);
  const isMobileDetailsLayout = useMediaQuery('(max-width: 850px)');

  // Calculated values
  const visibleErrorMessage = isLoading ? '' : errorMessage;
  const hasCharacters = characters.length > 0;
  const showPagination = !visibleErrorMessage && hasCharacters;

  const hasInlineDetails =
    isMobileDetailsLayout &&
    selectedCharacterId !== null &&
    characters.some(
      (character) => String(character.id) === selectedCharacterId
    );

  // Handlers
  const handlePageChange = (page: number): void => {
    changePage(page, totalPages);
  };

  const triggerTestError = (): void => {
    setHasTestError(true);
  };

  const handleDownloadSelected = (): void => {
    downloadSelectedCharactersCsv(selectedCharacters);
  };

  // Render helpers
  const detailsPanel = selectedCharacterId ? (
    <CharacterDetails
      characterId={selectedCharacterId}
      onClose={closeDetails}
    />
  ) : null;

  if (hasTestError) {
    throw new Error('Test error boundary error');
  }

  return (
    <>
      <Header />

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
            onClick={refreshCharacters}
          >
            {isRefreshing ? 'Refreshing results...' : 'Refresh results'}
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
      <button className="app-button" type="button" onClick={triggerTestError}>
        Test error boundary
      </button>
    </>
  );
}

export default CharactersPage;
