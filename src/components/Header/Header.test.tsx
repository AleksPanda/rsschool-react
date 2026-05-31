import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../context/theme-provider';

function renderHeader(): void {
  render(
    <ThemeProvider>
      <MemoryRouter>
        <Header />
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

  it('renders theme toggle button', () => {
    renderHeader();

    expect(
      screen.getByRole('button', { name: /light theme|dark theme/i })
    ).toBeInTheDocument();
  });
});
