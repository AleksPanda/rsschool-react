import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { mockCharacterResponse } from './test-utils/mock-character-response';
import { SEARCH_TERM_KEY } from './utils/local-storage';
import ThemeProvider from './context/theme-provider';
import type { CharacterResponse } from './types';
import ErrorBoundary from './components/ErrorBoundary';

vi.mock('./api/character-service', () => ({
  fetchCharacters: vi.fn(),
}));

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });
}

function renderApp(App: () => React.JSX.Element, initialEntries = ['/']): void {
  const queryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

function createPaginatedResponse(totalPages = 2): CharacterResponse {
  return {
    ...mockCharacterResponse,
    info: {
      ...mockCharacterResponse.info,
      count: totalPages,
      pages: totalPages,
    },
  };
}

describe('App URL state integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads characters with empty search term when localStorage is empty', async () => {
    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValueOnce(mockCharacterResponse);

    const { default: App } = await import('./App');

    renderApp(App);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(
        '',
        1,
        expect.any(AbortSignal)
      );
    });

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('reads search term and page from URL params on mount', async () => {
    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValueOnce(mockCharacterResponse);

    const { default: App } = await import('./App');

    renderApp(App, ['/?page=3&search=Rick']);

    expect(screen.getByLabelText(/search characters/i)).toHaveValue('Rick');

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(
        'Rick',
        3,
        expect.any(AbortSignal)
      );
    });

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('shows an error message when initial request fails', async () => {
    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockRejectedValueOnce(new Error('API error'));

    const { default: App } = await import('./App');

    renderApp(App);

    expect(
      await screen.findByText(
        'Unable to load characters. Please try again later.'
      )
    ).toBeInTheDocument();
  });

  it('applies search term from the form without saving it to localStorage', async () => {
    const user = userEvent.setup();

    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharacterResponse);

    const { default: App } = await import('./App');

    renderApp(App);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    const input = screen.getByLabelText(/search characters/i);

    await user.clear(input);
    await user.type(input, 'Morty');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem(SEARCH_TERM_KEY)).toBeNull();

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenLastCalledWith(
        'Morty',
        1,
        expect.any(AbortSignal)
      );
    });
  });

  it('trims search term before searching', async () => {
    const user = userEvent.setup();

    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharacterResponse);

    const { default: App } = await import('./App');

    renderApp(App);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    const input = screen.getByLabelText(/search characters/i);

    await user.clear(input);
    await user.type(input, '   Morty   ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenLastCalledWith(
        'Morty',
        1,
        expect.any(AbortSignal)
      );
    });

    expect(input).toHaveValue('Morty');
  });

  it('reuses cached character pages when navigating back', async () => {
    const user = userEvent.setup();
    const paginatedResponse = createPaginatedResponse();

    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValue(paginatedResponse);

    const { default: App } = await import('./App');

    renderApp(App, ['/?page=1']);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenLastCalledWith(
        '',
        2,
        expect.any(AbortSignal)
      );
    });

    expect(fetchCharacters).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole('button', { name: /previous/i }));

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    expect(fetchCharacters).toHaveBeenCalledTimes(2);
  });

  it('refetches the current characters page after manual refresh', async () => {
    const user = userEvent.setup();

    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharacterResponse);

    const { default: App } = await import('./App');

    renderApp(App);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(fetchCharacters).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /refresh results/i }));

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledTimes(2);
    });
  });

  it('shows error boundary fallback when test error button is clicked', async () => {
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValue(mockCharacterResponse);

    const { default: App } = await import('./App');

    renderApp(App);

    await user.click(
      await screen.findByRole('button', { name: /test error boundary/i })
    );

    expect(
      screen.getByRole('heading', { name: /something went wrong/i })
    ).toBeInTheDocument();
  });
});
