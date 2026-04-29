import { Component, type JSX } from 'react';
import SearchPanel from './components/SearchPanel';
import CharacterList from './components/CharacterList';
import type { AppState } from './types';

const initialState: AppState = {
  searchInput: '',
};

class App extends Component<object, AppState> {
  state: AppState = initialState;

  handleSearchInputChange = (value: string): void => {
    this.setState({ searchInput: value });
  };

  handleSearch = (): void => {
    console.log('Search is not connected yet:', this.state.searchInput);
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

          <CharacterList placeholder="Results will appear here." />
        </section>
      </main>
    );
  }
}

export default App;
