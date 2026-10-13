import { useState } from 'react';
import { Check } from 'lucide-react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApi } from '../../hooks/useApi.js';
import { formatDate, money, USERNAME_PATTERN } from '../../lib/format.js';
import ProfileSidebar from '../../components/ProfileSidebar.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { data: profile } = useApi('/profile');
  const [username, setUsername] = useState(user.username);
  const [status, setStatus] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    if (!USERNAME_PATTERN.test(username)) {
      setStatus({ ok: false, message: 'Username must be 6-20 letters, numbers or _ with no spaces.' });
      return;
    }
    try {
      const data = await api('/profile', { method: 'PATCH', body: { username } });
      setUser(data.user);
      setStatus({ ok: true, message: 'Username updated successfully!' });
    } catch (err) {
      setStatus({ ok: false, message: err.status === 409 ? 'Username already taken.' : 'Update failed. Please try again.' });
    }
  };

  return (
    <div className="px-4 lg:px-[10%] py-8 flex flex-col lg:flex-row gap-6">
      <ProfileSidebar />
      <section className="flex-1 bg-base-300 rounded-box p-6">
        <h1 className="text-2xl font-bold mb-6">MyAccount</h1>
        <form onSubmit={save} className="space-y-3">
          <label htmlFor="username" className="font-bold block">Username</label>
          <div className="flex gap-2 flex-wrap">
            <input id="username" className="input w-64" value={username} onChange={(e) => setUsername(e.target.value)} minLength={6} maxLength={20} required />
            <button type="submit" className="btn btn-accent px-6">Save</button>
          </div>
          {status && <p role="status" className={`font-bold text-sm ${status.ok ? 'text-success' : 'text-error'}`}>{status.message}</p>}
          <p className="text-sm opacity-60 max-w-2xl">
            Username is your unique name shown on all Excalibur pages. Use 6 - 20 letters, numbers or underscores, without
            spaces or other special characters.
          </p>
        </form>

        <div className="divider" />
        <h2 className="text-lg font-bold mb-3">Account information</h2>
        <dl className="grid grid-cols-[8rem_1fr] gap-y-2">
          <dt className="opacity-70">Email</dt>
          <dd className="flex items-center gap-2">{user.email} <Check size={16} className="text-success" /></dd>
          <dt className="opacity-70">Member since</dt>
          <dd>{formatDate(profile?.registerDate)}</dd>
          <dt className="opacity-70">Total spent</dt>
          <dd>{money(profile?.totalSpend)}</dd>
        </dl>
      </section>
    </div>
  );
}
