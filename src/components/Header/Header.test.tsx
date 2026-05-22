import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../context/theme-provider';

function renderHeader(triggerTestError = vi.fn()): void {
  render(
    <ThemeProvider>
      <MemoryRouter>
        <Header triggerTestError={triggerTestError} />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('Header', () => {
  it('renders about navigation link', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('renders test error boundary button', () => {
    renderHeader();

    expect(
      screen.getByRole('button', { name: /test error boundary/i })
    ).toBeInTheDocument();
  });

  it('calls triggerTestError when test error boundary button is clicked', async () => {
    const user = userEvent.setup();
    const triggerTestError = vi.fn();

    renderHeader(triggerTestError);

    const button = screen.getByRole('button', {
      name: /test error boundary/i,
    });

    await user.click(button);

    expect(triggerTestError).toHaveBeenCalledTimes(1);
  });
});
