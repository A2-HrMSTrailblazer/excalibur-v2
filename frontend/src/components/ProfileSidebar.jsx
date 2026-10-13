import { NavLink, useNavigate } from 'react-router-dom';
import { ListOrdered, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfileSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) => (isActive ? 'menu-active' : '');

  return (
    <aside className="lg:w-64 shrink-0">
      <ul className="menu bg-base-300 rounded-box w-full p-3 gap-1">
        <li><NavLink to="/profile" className={linkClass}><User size={18} /> MyAccount</NavLink></li>
        <li><NavLink to="/orders" className={linkClass}><ListOrdered size={18} /> Orders</NavLink></li>
        <li>
          <button type="button" className="text-error" onClick={async () => { await logout(); navigate('/login'); }}>
            <LogOut size={18} /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
