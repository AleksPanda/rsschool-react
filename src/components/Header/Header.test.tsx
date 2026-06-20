import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Header from './Header';
import ThemeProvider from '../../context/theme-provider';
import messages from '../../messages/en.json';

interface LinkMockProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
}

vi.mock('../../i18n/navigation', () => ({
  Link: ({ children, href, ...props }: LinkMockProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
}));

function renderHeader(): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    </NextIntlClientProvider>
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

  it('renders language controls', () => {
    renderHeader();

    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'RU' })).toBeInTheDocument();
  });
});
