import { getTranslations } from 'next-intl/server';

import ServerCharacterDetails from '@/components/CharacterDetails/CharacterDetails.server';
import ServerCharacterList from '@/components/CharacterList/CharacterList.server';
import ServerPagination from '@/components/Pagination/Pagination.server';
import RefreshButton from '@/components/RefreshButton';
import SearchForm from '@/components/SearchForm';
import SelectedCharactersPanel from '@/components/SelectedCharactersPanel';
import {
  fetchCharacterById,
  fetchCharacters,
} from '@/services/character-service';
import type { Character, CharacterResponse } from '@/types';
import {
  getCharacterId,
  getPage,
  getSearchTerm,
  type CharacterSearchParams,
} from '@/utils/search-params';
import './HomePage.scss';
import TestErrorButton from './TestErrorButton';

interface HomePageProps {
  searchParams: Promise<CharacterSearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = getPage(params);
  const searchTerm = getSearchTerm(params);
  const selectedCharacterId = getCharacterId(params);
  const t = await getTranslations('HomePage');
  let characterResponse: CharacterResponse | null = null;
  let selectedCharacter: Character | null = null;
  let hasLoadError = false;
  let hasDetailsLoadError = false;

  const [charactersResult, detailsResult] = await Promise.allSettled([
    fetchCharacters(searchTerm, currentPage),
    selectedCharacterId
      ? fetchCharacterById(selectedCharacterId)
      : Promise.resolve(null),
  ]);

  if (charactersResult.status === 'fulfilled') {
    characterResponse = charactersResult.value;
  } else {
    hasLoadError = true;
  }

  if (detailsResult.status === 'fulfilled') {
    selectedCharacter = detailsResult.value;
  } else {
    hasDetailsLoadError = true;
  }

  return (
    <>
      <section className="app__section">
        <SearchForm defaultValue={searchTerm} />
      </section>

      <section
        className="app__section"
        data-page={currentPage}
        data-search={searchTerm || undefined}
        data-details={selectedCharacterId ?? undefined}
        data-result-count={characterResponse?.results.length ?? 0}
        data-total-pages={characterResponse?.info.pages ?? 0}
      >
        <div className="app__section-header">
          <h2 className="app__section-title">{t('title')}</h2>

          <RefreshButton
            label={t('refreshResults')}
            pendingLabel={t('refreshingResults')}
            className="results-layout__refresh-button"
          />
        </div>

        <div
          className={
            selectedCharacterId
              ? 'results-layout results-layout--with-details'
              : 'results-layout'
          }
        >
          <div className="results-layout__list">
            {hasLoadError || !characterResponse ? (
              <div className="results-placeholder results-placeholder--error">
                <p>{t('loadError')}</p>
              </div>
            ) : (
              <ServerCharacterList
                characters={characterResponse.results}
                currentPage={currentPage}
                searchTerm={searchTerm}
              />
            )}

            <SelectedCharactersPanel />

            {characterResponse && (
              <ServerPagination
                currentPage={currentPage}
                totalPages={characterResponse.info.pages}
                searchTerm={searchTerm}
              />
            )}
          </div>

          <aside
            className="results-layout__details"
            aria-label={t('detailsTitle')}
          >
            {selectedCharacterId && (
              <ServerCharacterDetails
                character={selectedCharacter}
                hasLoadError={hasDetailsLoadError}
                currentPage={currentPage}
                searchTerm={searchTerm}
              />
            )}
          </aside>
        </div>
      </section>
      <footer className="results-page__footer">
        <TestErrorButton label={t('testError')} />
      </footer>
    </>
  );
}
