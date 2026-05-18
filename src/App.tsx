import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
