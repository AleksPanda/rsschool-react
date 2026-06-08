import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderResult } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCharacterById } from '../../api/character-service';
import { mockCharacter } from '../../test-utils/mock-character';
import CharacterDetails from './CharacterDetails';

vi.mock('../../api/character-service', () => ({
  fetchCharacterById: vi.fn(),
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

function renderCharacterDetails(
  onClose = vi.fn(),
  queryClient = createTestQueryClient()
): RenderResult {
  return render(
    <QueryClientProvider client={queryClient}>
      <CharacterDetails characterId="1" onClose={onClose} />
    </QueryClientProvider>
  );
}

describe('CharacterDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads and renders character details', async () => {
    vi.mocked(fetchCharacterById).mockResolvedValueOnce(mockCharacter);

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

    vi.mocked(fetchCharacterById).mockResolvedValueOnce(mockCharacter);

    renderCharacterDetails(handleClose);

    await user.click(screen.getByRole('button', { name: /close details/i }));

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('reuses cached character details after remounting', async () => {
    const queryClient = createTestQueryClient();
    vi.mocked(fetchCharacterById).mockResolvedValue(mockCharacter);

    const firstRender = renderCharacterDetails(vi.fn(), queryClient);

    expect(
      await screen.findByRole('heading', { name: 'Rick Sanchez' })
    ).toBeInTheDocument();
    expect(fetchCharacterById).toHaveBeenCalledTimes(1);

    firstRender.unmount();

    renderCharacterDetails(vi.fn(), queryClient);

    expect(
      await screen.findByRole('heading', { name: 'Rick Sanchez' })
    ).toBeInTheDocument();
    expect(fetchCharacterById).toHaveBeenCalledTimes(1);
  });

  it('refetches character details after manual refresh', async () => {
    const user = userEvent.setup();

    vi.mocked(fetchCharacterById).mockResolvedValue(mockCharacter);

    renderCharacterDetails();

    expect(
      await screen.findByRole('heading', { name: 'Rick Sanchez' })
    ).toBeInTheDocument();
    expect(fetchCharacterById).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /refresh details/i }));

    await screen.findByRole('heading', { name: 'Rick Sanchez' });
    expect(fetchCharacterById).toHaveBeenCalledTimes(2);
  });
});
