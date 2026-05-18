import type { JSX } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  triggerTestError: () => void;
}

function Header({ triggerTestError }: HeaderProps): JSX.Element {
  return (
    <div className="header-panel">
      <div className="header-panel__content">
        <h1 className="header-panel__title">Rick and Morty Character Search</h1>
        <p className="header-panel__subtitle">
          Search for characters from the Rick and Morty API.
        </p>
        <div className="header-panel__buttons-container">
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
        </div>
      </div>
      <img
        className="header-panel__image"
        src="/rick-n-morty.png"
        alt="Rick and Morty"
      />
    </div>
  );
}

export default Header;
