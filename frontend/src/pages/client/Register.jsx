import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client.js';
import { AuthCard } from './Login.jsx';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await api('/auth/register', { method: 'POST', body: form });
      navigate('/login?registered=1');
    } catch (err) {
      setError(err.message);
    }
  };

  const field = (name) => ({ value: form[name], onChange: (e) => setForm({ ...form, [name]: e.target.value }) });

  return (
    <AuthCard title="Create account" footer={<>Already have an account? <Link to="/login" className="link link-primary">Log in</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <input type="email" className="input w-full" placeholder="Email" aria-label="Email" required {...field('email')} />
        <input type="password" className="input w-full" placeholder="Password (at least 6 characters)" aria-label="Password" minLength={6} required {...field('password')} />
        <input type="password" className="input w-full" placeholder="Confirm password" aria-label="Confirm password" required {...field('confirmPassword')} />
        {error && <p role="alert" className="text-error font-bold text-sm">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">Register</button>
      </form>
    </AuthCard>
  );
}
