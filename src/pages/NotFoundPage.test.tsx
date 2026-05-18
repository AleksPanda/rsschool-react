import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renders not found content and return link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: '404 — Page not found' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rick and Morty' })).toHaveAttribute(
      'src',
      '/jerry.png'
    );
    expect(
      screen.getByRole('link', { name: /return to the main page/i })
    ).toHaveAttribute('href', '/');
  });
});
