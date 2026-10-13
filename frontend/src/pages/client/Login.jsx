import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../../components/Logo.jsx';

/** Only allow in-site return paths (avoids open redirects). */
export const safeReturnTo = (value) => (value?.startsWith('/') && !value.startsWith('//') ? value : '/');

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(form.email.trim(), form.password);
      void navigate(user.role === 'admin' ? '/admin/dashboard' : safeReturnTo(params.get('returnTo')));
    } catch (err) {
      setError(err.status === 401 ? 'Invalid email or password. Please try again.' : err.message);
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Log in" footer={<>New user? <Link to="/register" className="link link-primary">Create account</Link></>}>
      {params.get('registered') && <p role="status" className="text-success font-bold">Account created. Please log in.</p>}
      <form onSubmit={submit} className="space-y-4">
        <input className="input w-full" placeholder="Username / Email" aria-label="Username or email" autoComplete="username"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" className="input w-full" placeholder="Password" aria-label="Password" autoComplete="current-password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {error && <p role="alert" className="text-error font-bold text-sm">{error}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>Login</button>
      </form>
    </AuthCard>
  );
}

export function AuthCard({ title, children, footer }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="card bg-base-300 w-full max-w-md shadow-2xl">
        <div className="card-body gap-5">
          <div className="flex justify-center"><Logo className="h-12" /></div>
          <div>
            <p className="opacity-70">Hello and welcome!</p>
            <h1 className="text-3xl font-extrabold">{title}</h1>
            <p className="text-sm mt-1 opacity-80">{footer}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
