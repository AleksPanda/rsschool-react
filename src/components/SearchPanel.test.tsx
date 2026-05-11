import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchPanel from './SearchPanel';

describe('SearchPanel', () => {
  it('renders input and search button', () => {
    render(
      <SearchPanel value="Rick" onInputChange={vi.fn()} onSearch={vi.fn()} />
    );

    expect(screen.getByLabelText(/search characters/i)).toHaveValue('Rick');
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onInputChange when input value changes', () => {
    const handleInputChange = vi.fn();

    render(
      <SearchPanel
        value=""
        onInputChange={handleInputChange}
        onSearch={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/search characters/i), {
      target: { value: 'Morty' },
    });

    expect(handleInputChange).toHaveBeenCalledWith('Morty');
  });

  it('calls onSearch on button click and Enter submit', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(
      <SearchPanel
        value="Summer"
        onInputChange={vi.fn()}
        onSearch={handleSearch}
      />
    );

    await user.click(screen.getByRole('button', { name: /search/i }));
    await user.type(screen.getByLabelText(/search characters/i), '{Enter}');

    expect(handleSearch).toHaveBeenCalledTimes(2);
  });
});
