import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, AlertTriangle } from 'lucide-react';

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) return setError('All fields are required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      await register(name, email, password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-modal-overlay" className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-950/50"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-100">Create Account</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Join the FuelFinder NG community</p>
          </div>
          <button
            className="bg-slate-800 border border-slate-700 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-900 text-slate-400 p-1.5 rounded-lg text-xs transition-all flex items-center justify-center cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-medium outline-none focus:border-amber-500 transition-all placeholder-slate-700 text-sm"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/35 p-3 rounded-lg font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-sm py-3 rounded-lg transition-all shadow-lg shadow-amber-500/10 mt-1 flex items-center justify-center gap-2 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              'Creating account…'
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center font-medium">
            Already have an account?{' '}
            <button type="button" className="text-amber-500 hover:text-amber-400 font-bold" onClick={onSwitchToLogin}>
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
