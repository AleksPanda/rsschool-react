import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { mockCharacterResponse } from './test-utils/mock-character-response';
import { SEARCH_TERM_KEY } from './utils/local-storage';
import ThemeProvider from './context/theme-provider';

vi.mock('./api/character-service', () => ({
  fetchCharacters: vi.fn(),
}));

function renderApp(App: () => React.JSX.Element, initialEntries = ['/']): void {
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('App URL state integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
});
