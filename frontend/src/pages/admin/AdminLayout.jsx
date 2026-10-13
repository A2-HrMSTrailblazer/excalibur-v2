import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Box, CreditCard, KeyRound, LayoutDashboard, LogOut, Menu, ShoppingCart, Star, Store, Tag, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Box },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/orders', label: 'Order', icon: ShoppingCart },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/game-keys', label: 'Game Keys', icon: KeyRound },
  { to: '/admin/payments', label: 'Payment', icon: CreditCard },
  { to: '/admin/reviews', label: 'Review', icon: Star },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    if (!window.confirm('Log out of admin panel?')) return;
    await logout();
    navigate('/login');
  };

  return (
    <div data-theme="excalibur-admin" className="min-h-screen bg-base-200 flex">
      <aside className={`${open ? 'flex' : 'hidden'} lg:flex fixed lg:sticky top-0 z-40 h-screen w-60 flex-col bg-secondary text-secondary-content p-4`}>
        <div className="text-center font-extrabold text-xl leading-tight py-4 text-accent">Excalibur<br />Office</div>
        <ul className="menu w-full gap-1 flex-1 p-0 mt-4">
          {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'bg-accent text-accent-content font-bold' : 'hover:bg-white/10')}>
                <Icon size={18} /> {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className="menu w-full p-0 border-t border-white/10 pt-2">
          <li><NavLink to="/"><Store size={18} /> View store</NavLink></li>
          <li><button type="button" onClick={signOut} className="text-error"><LogOut size={18} /> Sign Out</button></li>
        </ul>
      </aside>
      {open && <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="navbar bg-base-100 shadow-sm px-4 sticky top-0 z-20">
          <button type="button" className="btn btn-ghost btn-square lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <span className="font-bold ml-2">Back office</span>
          <span className="ml-auto text-sm opacity-70">Signed in as {user?.email}</span>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
