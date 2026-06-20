'use client';

import {
  useCallback,
  useMemo,
  useSyncExternalStore,
  type JSX,
  type ReactNode,
} from 'react';

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
} from './theme-context';

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_CHANGE_EVENT = 'theme-change';

function getThemeSnapshot(): Theme {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : DEFAULT_THEME;
}

function subscribeToTheme(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => DEFAULT_THEME
  );

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="theme-root" data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
