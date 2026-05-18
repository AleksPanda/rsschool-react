import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

function AppLayout(): JSX.Element {
  return (
    <main className="app">
      <Outlet />
    </main>
  );
}

export default AppLayout;
