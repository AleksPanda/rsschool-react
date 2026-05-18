import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import PagePanel from './PagePanel';

interface HeaderProps {
  triggerTestError: () => void;
}

function Header({ triggerTestError }: HeaderProps): JSX.Element {
  return (
    <PagePanel
      title="Rick and Morty Character Search"
      description="Search for characters from the Rick and Morty API."
      imageSrc="/rick-n-morty.png"
      actions={
        <>
          <Link className="header-panel__test-error-button" to="/about">
            About
          </Link>
          <button
            className="header-panel__test-error-button"
            type="button"
            onClick={triggerTestError}
          >
            Test error boundary
          </button>
        </>
      }
    />
  );
}

export default Header;
