import { Component, type JSX } from 'react';
import Header from './components/Header';
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
  isLoading: false,
  errorMessage: '',
  hasTestError: false,
};

class App extends Component<object, AppState> {
  state: AppState = initialState;

  async componentDidMount(): Promise<void> {
    await this.loadCharacters(this.state.lastSearchTerm);
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

    this.setState({
      searchInput: searchTerm,
      lastSearchTerm: searchTerm,
    });

    await this.loadCharacters(searchTerm);
  };

  loadCharacters = async (searchTerm: string): Promise<void> => {
    this.setState({ isLoading: true, errorMessage: '' });

    try {
      const data = await fetchCharacters(searchTerm, 1);

      this.setState({ characters: data.results });
    } catch {
      this.setState({
        characters: [],
        errorMessage: 'Unable to load characters. Please try again later.',
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  triggerTestError = (): void => {
    this.setState({ hasTestError: true });
  };

  render(): JSX.Element {
    if (this.state.hasTestError) {
      throw new Error('Test error boundary error');
    }

    return (
      <main className="app">
        <section className="app__section">
          <Header triggerTestError={this.triggerTestError} />
        </section>

        <section className="app__section">
          <SearchPanel
            value={this.state.searchInput}
            onInputChange={this.handleSearchInputChange}
            onSearch={this.handleSearch}
          />
        </section>

        <section className="app__section">
          <h2 className="app__section-title">Results</h2>

          <CharacterList
            characters={this.state.characters}
            errorMessage={this.state.errorMessage}
            isLoading={this.state.isLoading}
            placeholder="Results will appear here."
          />
        </section>
      </main>
    );
  }
}

export default App;
