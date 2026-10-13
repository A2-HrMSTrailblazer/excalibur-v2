import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutGrid, ListOrdered, LogOut, Search, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import Logo from './Logo.jsx';

export default function Header({ onOpenCategories }) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');

  const submit = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/store?search=${encodeURIComponent(q)}` : '/store');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-secondary sticky top-0 z-40 shadow-lg">
      <div className="flex items-center gap-4 px-4 lg:px-[10%] h-[70px]">
        <Link to="/" className="shrink-0" aria-label="Excalibur home">
          <Logo />
        </Link>

        <form onSubmit={submit} className="flex-1 max-w-xl mx-auto hidden sm:block" role="search">
          <label className="input w-full bg-white/10 border-white/20 rounded-full">
            <Search size={18} className="opacity-70" />
            <input
              type="search"
              name="search"
              aria-label="Search games"
              placeholder="Search for games, top-ups and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <Link to="/cart" className="btn btn-ghost btn-circle" aria-label="Shopping cart">
            <div className="indicator">
              <ShoppingCart size={24} />
              {cart.totalQty > 0 && (
                <span className="badge badge-primary badge-xs indicator-item">{cart.totalQty}</span>
              )}
            </div>
          </Link>

          {user ? (
            <div className="dropdown dropdown-end">
              <button type="button" tabIndex={0} className="btn btn-ghost gap-2" aria-label="Account menu">
                <User size={22} />
                <span className="hidden md:inline">{user.username}</span>
              </button>
              <ul tabIndex={0} className="dropdown-content menu bg-neutral rounded-box z-50 w-52 p-2 shadow-xl mt-2">
                {user.role === 'admin' && (
                  <li><Link to="/admin/dashboard"><LayoutGrid size={16} /> Admin panel</Link></li>
                )}
                <li><Link to="/profile"><User size={16} /> MyAccount</Link></li>
                <li><Link to="/orders"><ListOrdered size={16} /> Orders</Link></li>
                <li className="border-t border-white/10 mt-1 pt-1">
                  <button type="button" className="text-error font-bold" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
            <Link to="/login" className="btn btn-ghost btn-circle sm:hidden" aria-label="Log in"><User size={22} /></Link>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User size={22} />
              <Link to="/login" className="link link-hover">Log in</Link>
              <span>|</span>
              <Link to="/register" className="link link-hover">Register</Link>
            </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-base-300/60 px-4 lg:px-[10%] py-2 flex items-center gap-6 text-sm">
        <button type="button" className="btn btn-ghost btn-sm gap-2" onClick={onOpenCategories}>
          <LayoutGrid size={16} /> Categories
        </button>
        <Link to="/store" className="link link-hover">Store</Link>
        <Link to="/about" className="link link-hover hidden sm:inline">About Us</Link>
        <Link to="/contact" className="link link-hover hidden sm:inline">Contact Us</Link>
        <form onSubmit={submit} className="sm:hidden flex-1" role="search">
          <input
            type="search"
            aria-label="Search games (mobile)"
            className="input input-sm w-full"
            placeholder="Search games"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
