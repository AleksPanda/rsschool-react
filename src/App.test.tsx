import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CharacterResponse } from './types';
import { SEARCH_TERM_KEY } from './utils/local-storage';

vi.mock('./api/character-service', () => ({
  fetchCharacters: vi.fn(),
}));

const mockResponse: CharacterResponse = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: {
        name: 'Earth',
        url: '',
      },
      location: {
        name: 'Citadel of Ricks',
        url: '',
      },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    },
  ],
};

describe('App localStorage integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('loads characters with empty search term when localStorage is empty', async () => {
    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValueOnce(mockResponse);

    const { default: App } = await import('./App');

    render(<App />);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith('', 1);
    });

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('reads search term from localStorage on mount', async () => {
    localStorage.setItem(SEARCH_TERM_KEY, 'Rick');

    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValueOnce(mockResponse);

    const { default: App } = await import('./App');

    render(<App />);

    expect(screen.getByLabelText(/search characters/i)).toHaveValue('Rick');

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith('Rick', 1);
    });

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('shows an error message when initial request fails', async () => {
    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockRejectedValueOnce(new Error('API error'));

    const { default: App } = await import('./App');

    render(<App />);

    expect(
      await screen.findByText(
        'Unable to load characters. Please try again later.'
      )
    ).toBeInTheDocument();
  });

  it('saves search term to localStorage after user search', async () => {
    const user = userEvent.setup();

    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValue(mockResponse);

    const { default: App } = await import('./App');

    render(<App />);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    const input = screen.getByLabelText(/search characters/i);

    await user.clear(input);
    await user.type(input, 'Morty');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem(SEARCH_TERM_KEY)).toBe('Morty');

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenLastCalledWith('Morty', 1);
    });
  });

  it('trims search term before searching', async () => {
    const user = userEvent.setup();

    const { fetchCharacters } = await import('./api/character-service');
    vi.mocked(fetchCharacters).mockResolvedValue(mockResponse);

    const { default: App } = await import('./App');

    render(<App />);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    const input = screen.getByLabelText(/search characters/i);

    await user.clear(input);
    await user.type(input, '  Morty  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenLastCalledWith('Morty', 1);
    });

    expect(input).toHaveValue('Morty');
  });
});
