import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders course and author links', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /the rolling scopes school react course/i,
      })
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(
      screen.getByRole('link', { name: /return to the main page/i })
    ).toHaveAttribute('href', '/');
  });
});
