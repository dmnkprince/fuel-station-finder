import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Email and password are required.');

    setLoading(true);
    try {
      const user = await login(email, password);
      onClose();
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'station_manager') {
        navigate('/manager');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-modal-overlay" className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl shadow-slate-950/50"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Hedfddader */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-100">Welcome Back</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Sign in to your account</p>
          </div>
          <button
            className="bg-slate-800 border border-slate-700 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-900 text-slate-400 p-1.5 rounded-lg text-xs transition-all"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-medium outline-none focus:border-amber-500 transition-all placeholder-slate-700 text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-medium outline-none focus:border-amber-500 transition-all placeholder-slate-700 text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/35 p-3 rounded-lg font-medium">⚠️ {error}</p>}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-sm py-3 rounded-lg transition-all shadow-lg shadow-amber-500/10 mt-1"
            disabled={loading}
          >
            {loading ? 'Signing in…' : '🔑 Sign In'}
          </button>

          {/* <p className="text-xs text-slate-500 text-center font-medium">
            Don't have an account?{' '}
            <button type="button" className="text-amber-500 hover:text-amber-400 font-bold" onClick={onSwitchToRegister}>
              Register
            </button>
          </p> */}
        </form>
      </div>
    </div>
  );
}
