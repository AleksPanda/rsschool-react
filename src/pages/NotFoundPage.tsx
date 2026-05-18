import type { JSX } from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  return (
    <section className="app__section">
      <h2 className="app__section-title">404 — Page not found</h2>

      <p>The page you are looking for does not exist.</p>

      <Link className="app-link" to="/">
        Return to the main page
      </Link>
    </section>
  );
}

export default NotFoundPage;
