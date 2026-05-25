import type { JSX, ReactNode } from 'react';
import './PagePanel.scss';

interface PagePanelProps {
  title: string;
  description: ReactNode;
  imageSrc?: string;
  actions: ReactNode;
}

function PagePanel({
  title,
  description,
  imageSrc,
  actions,
}: PagePanelProps): JSX.Element {
  return (
    <section className="app__section">
      <div className="header-panel">
        <div className="header-panel__content">
          <h1 className="header-panel__title">{title}</h1>

          <div className="page-panel__body">{description}</div>

          <div className="header-panel__buttons-container">{actions}</div>
        </div>

        {imageSrc && (
          <img
            className="header-panel__image"
            src={imageSrc}
            alt="Rick and Morty"
          />
        )}
      </div>
    </section>
  );
}

export default PagePanel;
