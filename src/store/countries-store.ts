import { create } from 'zustand';
import countriesData from '../data/countries.json';

type Country = {
  name: string;
  code: string;
};

type CountriesState = {
  countries: string[];
};

const countries = countriesData as Country[];

export const COUNTRIES = countries.map((country) => country.name);

export const useCountriesStore = create<CountriesState>(() => ({
  countries: COUNTRIES,
}));
