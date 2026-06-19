import type { JSX } from 'react';
import { Link } from 'react-router-dom';

import PagePanel from '../../components/PagePanel';

import './AboutPage.scss';

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/AleksPanda',
    label: 'GitHub',
    icon: '/github-icon.png',
    iconClassName: 'about-page__social-icon--github',
  },
  {
    href: 'https://www.linkedin.com/in/aleksandra-potapova-dev/',
    label: 'LinkedIn',
    icon: '/linkedIn-icon.png',
    iconClassName: '',
  },
];

function AboutPage(): JSX.Element {
  return (
    <PagePanel
      title="About"
      description={
        <div className="about-page">
          <div className="about-page__intro">
            <p className="about-page__text about-page__intro-text">
              Hi! 👋 My name is Aleksandra. I am a frontend developer working
              mostly with React, TypeScript, JavaScript, and modern frontend
              tooling.
            </p>
          </div>

          <div className="about-page__social-section">
            <p className="about-page__section-label">
              Check out my socials below!
            </p>

            <div className="about-page__socials">
              {SOCIAL_LINKS.map(({ href, label, icon, iconClassName }) => (
                <a
                  key={label}
                  className="about-page__social-link"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon && (
                    <img
                      className={
                        iconClassName
                          ? `about-page__social-icon ${iconClassName}`
                          : 'about-page__social-icon'
                      }
                      src={icon}
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          <p className="about-page__tagline">
            Let&apos;s build clean and useful applications.
          </p>

          <div className="about-page__course">
            <p className="about-page__text">
              This application was created as part of{' '}
              <a
                className="about-page__course-link"
                href="https://rs.school/courses/reactjs"
                target="_blank"
                rel="noreferrer"
              >
                The Rolling Scopes School React course
              </a>
              .
            </p>
          </div>
        </div>
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
