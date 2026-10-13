import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import CategoryDrawer from './CategoryDrawer.jsx';

export default function ClientLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div data-theme="excalibur" className="min-h-screen flex flex-col">
      <Header onOpenCategories={() => setDrawerOpen(true)} />
      <CategoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
