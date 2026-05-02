import { Component, type JSX } from 'react';
import SearchPanel from './components/SearchPanel';
import CharacterList from './components/CharacterList';
import { fetchCharacters } from './api/character-service';
import { getSavedSearchTerm, saveSearchTerm } from './utils/local-storage';
import type { AppState } from './types';

const savedSearchTerm = getSavedSearchTerm();

const initialState: AppState = {
  searchInput: savedSearchTerm,
  lastSearchTerm: savedSearchTerm,
  characters: [],
};

class App extends Component<object, AppState> {
  state: AppState = initialState;

  async componentDidMount(): Promise<void> {
    const data = await fetchCharacters(this.state.lastSearchTerm, 1);

    this.setState({ characters: data.results });
  }

  handleSearchInputChange = (value: string): void => {
    this.setState({ searchInput: value });
  };

  handleSearch = async (): Promise<void> => {
    const searchTerm = this.state.searchInput.trim();

    if (searchTerm === this.state.lastSearchTerm) {
      return;
    }

    saveSearchTerm(searchTerm);

    const data = await fetchCharacters(searchTerm, 1);

    this.setState({
      searchInput: searchTerm,
      lastSearchTerm: searchTerm,
      characters: data.results,
    });
  };

  render(): JSX.Element {
    return (
      <main className="app">
        <section className="app__section app__section--header">
          <h1 className="app__title">Rick and Morty Character Search</h1>
          <p className="app__subtitle">
            Search for characters from the Rick and Morty API.
          </p>
        </section>

        <section className="app__section app__section--search">
          <SearchPanel
            value={this.state.searchInput}
            onInputChange={this.handleSearchInputChange}
            onSearch={this.handleSearch}
          />
        </section>

        <section className="app__section app__section--results">
          <h2 className="app__section-title">Results</h2>

          <CharacterList
            characters={this.state.characters}
            placeholder="Results will appear here."
          />
        </section>
      </main>
    );
  }
}

export default App;
