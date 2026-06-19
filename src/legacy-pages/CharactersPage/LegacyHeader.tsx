import type { JSX } from 'react';
import { Link } from 'react-router-dom';

import PagePanel from '../../components/PagePanel';
import { useTheme } from '../../hooks/use-theme';

function LegacyHeader(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <PagePanel
      title="Rick and Morty Character Search"
      description="Search for characters from the Rick and Morty API."
      imageSrc="/rick-n-morty.png"
      actions={
        <>
          <button
            className="app-button theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === 'light'}
          >
            {theme === 'dark' ? 'Light theme' : 'Dark theme'}
          </button>

          <Link className="app-button" to="/about">
            About
          </Link>
        </>
      }
    />
  );
}

export default LegacyHeader;
