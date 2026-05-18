import type { JSX } from 'react';

function AboutPage(): JSX.Element {
  return (
    <section className="app__section">
      <h2 className="app__section-title">About</h2>

      <p>
        This application was created as part of The Rolling Scopes School React
        course.
      </p>

      <p>Author: Aleksandra Potapova</p>

      <a
        className="app-link"
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noreferrer"
      >
        RS School React course
      </a>
    </section>
  );
}

export default AboutPage;
