import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import PagePanel from '../../components/PagePanel';

function NotFoundPage(): JSX.Element {
  return (
    <PagePanel
      title="404 — Page not found"
      description="The page you are looking for does not exist."
      imageSrc="/jerry.png"
      actions={
        <Link className="app-button" to="/">
          Return to the main page
        </Link>
      }
    />
  );
}

export default NotFoundPage;
