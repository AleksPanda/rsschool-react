import type { JSX, SyntheticEvent } from 'react';
import './SearchPanel.scss';

interface SearchPanelProps {
  value: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
}

function SearchPanel({
  value,
  onInputChange,
  onSearch,
}: SearchPanelProps): JSX.Element {
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSearch();
  };

  return (
    <div className="search-panel">
      <label className="search-panel__label" htmlFor="character-search">
        Search characters
      </label>

      <form className="search-panel__controls" onSubmit={handleSubmit}>
        <input
          id="character-search"
          className="search-panel__input"
          type="text"
          placeholder="Type a character name..."
          value={value}
          onChange={(event) => onInputChange(event.target.value)}
        />

        <button className="search-panel__button" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
