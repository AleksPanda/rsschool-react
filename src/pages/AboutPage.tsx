import type { JSX } from 'react';
import { Link } from 'react-router-dom';

function AboutPage(): JSX.Element {
  return (
    <section className="app__section about-page">
      <h2 className="app__section-title">About</h2>

      <div className="about-page__content">
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
      </div>

      <Link className="app__test-error-button about-page__return-link" to="/">
        Return to the main page
      </Link>
    </section>
  );
}

export default AboutPage;
