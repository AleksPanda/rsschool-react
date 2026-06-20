import { getTranslations } from 'next-intl/server';

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

  return (
    <section
      className="app__section"
      data-page={currentPage}
      data-search={searchTerm || undefined}
      data-details={selectedCharacterId ?? undefined}
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
          <div className="results-placeholder">
            <p>{t('emptyResults')}</p>
          </div>
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
