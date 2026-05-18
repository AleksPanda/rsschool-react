import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import CharactersPage from './pages/CharactersPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './components/AppLayout';
import CharacterDetails from './components/CharacterDetails';

function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CharactersPage />}>
          <Route path="details/:characterId" element={<CharacterDetails />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
