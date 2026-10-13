import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import Logo from './Logo.jsx';

/** Slide-in platform list (replaces the old sidebar.ejs + header.js toggle). */
export default function CategoryDrawer({ open, onClose }) {
  const { data: categories } = useApi(open ? '/categories' : null);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-label="Categories">
      <nav className="w-72 bg-secondary h-full p-5 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <Logo className="h-8" />
          <button type="button" className="btn btn-ghost btn-sm btn-circle" aria-label="Close categories" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="divider my-2" />
        <ul className="menu w-full p-0">
          {(categories ?? []).map((cat) => (
            <li key={cat.id}>
              <Link to={`/store?platform=${encodeURIComponent(cat.name)}`} onClick={onClose}>
                {cat.name}
              </Link>
            </li>
          ))}
          {categories && categories.length === 0 && <li className="opacity-60">No categories available.</li>}
        </ul>
      </nav>
      <button type="button" className="flex-1 bg-black/60" aria-label="Close categories overlay" onClick={onClose} />
    </div>
  );
}
