import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import PagePanel from '../../components/PagePanel';
import './AboutPage.scss';

function AboutPage(): JSX.Element {
  return (
    <PagePanel
      title="About"
      description={
        <>
          <p className="about-page__text">
            This application was created as part of{' '}
            <a
              className="app-link"
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
            >
              The Rolling Scopes School React course
            </a>
            .
          </p>

          <p className="about-page__text">
            Author:{' '}
            <a
              className="app-link"
              href="https://github.com/AleksPanda"
              target="_blank"
              rel="noreferrer"
            >
              Aleksandra Potapova on GitHub
            </a>
            .
          </p>
        </>
      }
      actions={
        <Link className="app-button" to="/">
          Return to the main page
        </Link>
      }
    />
  );
}

export default AboutPage;
