import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCharacterById } from '../../api/character-service';
import type { Character } from '../../types';
import CharacterDetails from './CharacterDetails';

vi.mock('../../api/character-service', () => ({
  fetchCharacterById: vi.fn(),
}));

const character: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth (C-137)',
    url: 'https://rickandmortyapi.com/api/location/1',
  },
  location: {
    name: 'Citadel of Ricks',
    url: 'https://rickandmortyapi.com/api/location/3',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

function renderCharacterDetails(onClose = vi.fn()): void {
  render(<CharacterDetails characterId="1" onClose={onClose} />);
}

describe('CharacterDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads and renders character details', async () => {
    vi.mocked(fetchCharacterById).mockResolvedValueOnce(character);

    renderCharacterDetails();

    expect(screen.getByText(/loading details/i)).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Rick Sanchez' })
    ).toBeInTheDocument();
    expect(fetchCharacterById).toHaveBeenCalledWith(
      '1',
      expect.any(AbortSignal)
    );
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('renders error message when details request fails', async () => {
    vi.mocked(fetchCharacterById).mockRejectedValueOnce(new Error('API error'));

    renderCharacterDetails();

    expect(
      await screen.findByText(
        'Unable to load character details. Please try again later.'
      )
    ).toBeInTheDocument();
  });

  it('closes details panel and returns to the main page', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    vi.mocked(fetchCharacterById).mockResolvedValueOnce(character);

    renderCharacterDetails(handleClose);

    await user.click(screen.getByRole('button', { name: /close details/i }));

    expect(handleClose).toHaveBeenCalledOnce();
  });
});
