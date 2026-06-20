import { getTranslations } from 'next-intl/server';

import ServerCharacterList from '@/components/CharacterList/CharacterList.server';
import ServerPagination from '@/components/Pagination/Pagination.server';
import { fetchCharacters } from '@/services/character-service';
import type { CharacterResponse } from '@/types';
import {
  getCharacterId,
  getPage,
  getSearchTerm,
  type CharacterSearchParams,
} from '@/utils/search-params';
import './HomePage.scss';

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
  let hasLoadError = false;

  try {
    characterResponse = await fetchCharacters(searchTerm, currentPage);
  } catch {
    hasLoadError = true;
  }

  return (
    <section
      className="app__section"
      data-page={currentPage}
      data-search={searchTerm || undefined}
      data-details={selectedCharacterId ?? undefined}
      data-result-count={characterResponse?.results.length ?? 0}
      data-total-pages={characterResponse?.info.pages ?? 0}
    >
      <div className="app__section-header">
        <div>
          <h2 className="app__section-title">{t('title')}</h2>
          <p className="results-page__summary">
            {searchTerm
              ? t('searchSummary', { searchTerm, page: currentPage })
              : t('pageSummary', { page: currentPage })}
          </p>
        </div>
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
            <>
              <ServerCharacterList
                characters={characterResponse.results}
                currentPage={currentPage}
                searchTerm={searchTerm}
              />

              <ServerPagination
                currentPage={currentPage}
                totalPages={characterResponse.info.pages}
                searchTerm={searchTerm}
              />
            </>
          )}
        </div>

        {selectedCharacterId && (
          <aside
            className="results-layout__details details-shell"
            aria-label={t('detailsTitle')}
          >
            <h3 className="details-shell__title">{t('detailsTitle')}</h3>
            <p className="details-shell__character">
              {t('selectedCharacter', { id: selectedCharacterId })}
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
