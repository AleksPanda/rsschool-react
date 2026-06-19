import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import CharactersPage from './legacy-pages/CharactersPage';
import AboutPage from './legacy-pages/AboutPage';
import NotFoundPage from './legacy-pages/NotFoundPage';
import AppLayout from './components/AppLayout';

function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CharactersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
