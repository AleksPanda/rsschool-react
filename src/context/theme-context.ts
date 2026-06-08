import { createContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'rick-and-morty-theme';
const DEFAULT_THEME: Theme = 'dark';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export { DEFAULT_THEME, THEME_STORAGE_KEY, ThemeContext };
export type { Theme, ThemeContextValue };
