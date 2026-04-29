import type { JSX } from 'react';

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
  return (
    <div className="search-panel">
      <label className="search-panel__label" htmlFor="character-search">
        Search characters
      </label>

      <div className="search-panel__controls">
        <input
          id="character-search"
          className="search-panel__input"
          type="text"
          placeholder="Type a character name..."
          value={value}
          onChange={(event) => onInputChange(event.target.value)}
        />

        <button
          className="search-panel__button"
          type="button"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchPanel;
