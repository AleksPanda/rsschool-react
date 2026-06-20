import { getTranslations } from 'next-intl/server';
import type { JSX } from 'react';

import { Link } from '../../i18n/navigation';
import './Pagination.scss';

interface ServerPaginationProps {
  currentPage: number;
  totalPages: number;
  searchTerm: string;
}

function createPageHref(page: number, searchTerm: string): string {
  const params = new URLSearchParams({ page: String(page) });

  if (searchTerm) {
    params.set('search', searchTerm);
  }

  return `/?${params.toString()}`;
}

export default async function ServerPagination({
  currentPage,
  totalPages,
  searchTerm,
}: ServerPaginationProps): Promise<JSX.Element | null> {
  if (totalPages <= 1) {
    return null;
  }

  const t = await getTranslations('Pagination');

  return (
    <nav className="pagination" aria-label={t('label')}>
      {currentPage === 1 ? (
        <span
          className="pagination__button pagination__button--disabled"
          aria-disabled="true"
        >
          {t('previous')}
        </span>
      ) : (
        <Link
          className="pagination__button"
          href={createPageHref(currentPage - 1, searchTerm)}
        >
          {t('previous')}
        </Link>
      )}

      <span className="pagination__status">
        {t('status', { currentPage, totalPages })}
      </span>

      {currentPage === totalPages ? (
        <span
          className="pagination__button pagination__button--disabled"
          aria-disabled="true"
        >
          {t('next')}
        </span>
      ) : (
        <Link
          className="pagination__button"
          href={createPageHref(currentPage + 1, searchTerm)}
        >
          {t('next')}
        </Link>
      )}
    </nav>
  );
}
