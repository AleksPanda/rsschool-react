import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  createCharacterSearchParams,
  getPageFromSearchParams,
  getSearchTermFromSearchParams,
} from '../utils/url-search-params';

interface UseCharacterUrlStateResult {
  currentPage: number;
  appliedSearchTerm: string;
  selectedCharacterId: string | null;
  selectedCharacterNumericId: number;
  hasDetails: boolean;
  applySearch: (searchTerm: string) => void;
  closeDetails: () => void;
  changePage: (page: number, totalPages: number) => void;
  getDetailsPath: (characterId: number) => string;
}

export function useCharacterUrlState(): UseCharacterUrlStateResult {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const hasDetails = Boolean(selectedCharacterId);

  useEffect(() => {
    if (searchParams.has('page')) {
      return;
    }

    setSearchParams(createCharacterSearchParams(1, appliedSearchTerm), {
      replace: true,
    });
  }, [appliedSearchTerm, searchParams, setSearchParams]);

  const applySearch = (searchTerm: string): void => {
    if (searchTerm === appliedSearchTerm && currentPage === 1) {
      return;
    }

    const params = createCharacterSearchParams(1, searchTerm);

    navigate({
      pathname: '/',
      search: `?${params.toString()}`,
    });
  };

  const closeDetails = (): void => {
    const params = new URLSearchParams(searchParams);

    params.delete('details');
    setSearchParams(params);
  };

  const changePage = (page: number, totalPages: number): void => {
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

  return {
    currentPage,
    appliedSearchTerm,
    selectedCharacterId,
    selectedCharacterNumericId,
    hasDetails,
    applySearch,
    closeDetails,
    changePage,
    getDetailsPath,
  };
}
