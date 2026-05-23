import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockCharacter } from '../../test-utils/mock-character';
import CharacterList from './CharacterList';

const placeholder = 'Test results will appear here.';
const errorMessage = 'Test error';

describe('CharacterList', () => {
  it('renders loading state', () => {
    render(
      <CharacterList
        characters={[]}
        errorMessage=""
        isLoading
        placeholder={placeholder}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders an error message', () => {
    render(
      <CharacterList
        characters={[]}
        errorMessage={errorMessage}
        isLoading={false}
        placeholder={placeholder}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders the empty placeholder', () => {
    render(
      <CharacterList
        characters={[]}
        errorMessage=""
        isLoading={false}
        placeholder={placeholder}
      />
    );

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('renders provided character details', () => {
    render(
      <CharacterList
        characters={[mockCharacter]}
        errorMessage=""
        isLoading={false}
        placeholder={placeholder}
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human • Alive • Male')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();

    const image = screen.getByRole('img', { name: 'Rick Sanchez' });

    expect(image).toHaveAttribute(
      'src',
      'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    );
  });
});
