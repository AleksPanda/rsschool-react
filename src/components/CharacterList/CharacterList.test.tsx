import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockCharacter } from '../../test-utils/mock-character';
import CharacterList from './CharacterList';
import type { ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const placeholder = 'Test results will appear here.';
const errorMessage = 'Test error';

const defaultProps: ComponentProps<typeof CharacterList> = {
  characters: [],
  errorMessage: '',
  isLoading: false,
  placeholder,
  selectedCharacterIds: [],
  onToggleCharacterSelection: vi.fn(),
};

const secondMockCharacter = {
  ...mockCharacter,
  id: 2,
  name: 'Morty Smith',
  gender: 'Male',
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  location: {
    name: 'Earth (Replacement Dimension)',
    url: 'https://rickandmortyapi.com/api/location/20',
  },
};

describe('CharacterList', () => {
  it('renders loading state', () => {
    render(<CharacterList {...defaultProps} isLoading />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders an error message', () => {
    render(<CharacterList {...defaultProps} errorMessage={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders the empty placeholder', () => {
    render(<CharacterList {...defaultProps} />);

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('renders provided character details', () => {
    render(<CharacterList {...defaultProps} characters={[mockCharacter]} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human • Alive • Male')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();

    const image = screen.getByRole('img', { name: 'Rick Sanchez' });

    expect(image).toHaveAttribute(
      'src',
      'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    );
  });

  it('calls selection handler when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggleCharacterSelection = vi.fn();

    render(
      <CharacterList
        {...defaultProps}
        characters={[mockCharacter]}
        onToggleCharacterSelection={onToggleCharacterSelection}
      />
    );

    await user.click(
      screen.getByRole('checkbox', { name: /select rick sanchez/i })
    );

    expect(onToggleCharacterSelection).toHaveBeenCalledWith(mockCharacter);
  });

  it('marks checkbox as checked when character is selected', () => {
    render(
      <CharacterList
        {...defaultProps}
        characters={[mockCharacter]}
        selectedCharacterIds={[mockCharacter.id]}
      />
    );

    expect(
      screen.getByRole('checkbox', { name: /select rick sanchez/i })
    ).toBeChecked();
  });

  it('renders character details link when details path is provided', () => {
    render(
      <MemoryRouter>
        <CharacterList
          {...defaultProps}
          characters={[mockCharacter]}
          getDetailsPath={(characterId) => `/?details=${characterId}`}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /view details for rick sanchez/i })
    ).toHaveAttribute('href', '/?details=1');
  });

  it('renders inline details after selected character', () => {
    render(
      <CharacterList
        {...defaultProps}
        characters={[mockCharacter, secondMockCharacter]}
        selectedCharacterId={mockCharacter.id}
        detailsOutlet={<div>Rick details panel</div>}
      />
    );

    expect(screen.getByText('Rick details panel')).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });
});
