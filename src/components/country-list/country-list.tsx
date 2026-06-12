import { memo, useMemo } from 'react';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { List, type RowComponentProps } from 'react-window';

import styles from './country-list.module.css';

const COUNTRY_CARD_BASE_HEIGHT = 160;
const COUNTRY_TABLE_ROW_HEIGHT = 36;
const COUNTRY_LIST_HEIGHT = 700;

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

type CountryRowProps = {
  countries: Country[];
  selectedColumns: string[];
  selectedYear: number;
};

const CountryRow = ({
  index,
  style,
  countries,
  selectedColumns,
  selectedYear,
}: RowComponentProps<CountryRowProps>) => {
  const country = countries[index];

  return (
    <div style={style} className={styles.countryRow}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      const normalizedSearchQuery = searchQuery.toLowerCase();

      return countries
        .filter((c) => {
          const matchesSearch = c.id.toLowerCase().includes(normalizedSearchQuery);
          const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
          } else {
            const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
            const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
            return sortOrder === 'asc' ? popA - popB : popB - popA;
          }
        });
    }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const rowHeight = COUNTRY_CARD_BASE_HEIGHT + selectedColumns.length * COUNTRY_TABLE_ROW_HEIGHT;

    const rowProps = useMemo(() => {
      return {
        countries: filteredCountries,
        selectedColumns,
        selectedYear,
      };
    }, [filteredCountries, selectedColumns, selectedYear]);

    return (
      <List
        className={styles.countryList}
        rowComponent={CountryRow}
        rowCount={filteredCountries.length}
        rowHeight={rowHeight}
        rowProps={rowProps}
        overscanCount={3}
        style={{ height: COUNTRY_LIST_HEIGHT, width: '100%' }}
      />
    );
  }
);
