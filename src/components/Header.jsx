import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { Shield, Fuel, LogOut } from 'lucide-react';

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isManager, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const switchToRegister = () => { setShowLogin(false); setShowRegister(true); };
  const switchToLogin = () => { setShowRegister(false); setShowLogin(true); };

  const navLink = (to, label, id) => (
    <Link
      to={to}
      id={id}
      className={`font-semibold text-sm px-2 py-1 rounded-lg transition-all ${
        pathname === to ? 'text-slate-100 bg-slate-800' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header id="main-header" className="mb-0.5 h-14 bg-re-900 border-b border-slate-800 z-50 backdrop-blur-md shrink-0 flex items-center">
        <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2">
            <img src="/img/logo.jpg" alt="" className="h-10 w-10 object-cover rounded-full" />
            <Link to="/" className="font-extrabold text-xl tracking-tight transition hover:opacity-85 flex items-center gap-1">
              <span className="text-slate-100 text-2xl lg:text-3xl">FuelFinder</span>
              <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded text-sm font-bold hidden xs:inline-block">NG</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {navLink('/', 'Map View', 'nav-home')}
            {navLink('/about', 'About', 'nav-about')}

            {isAdmin && navLink('/admin', 'Admin', 'nav-admin')}
            {isManager && navLink('/manager', 'Dashboard', 'nav-manager')}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="user-menu-toggle"
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-black text-slate-950">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                  <span className="hidden sm:inline truncate max-w-[80px]">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 min-w-[160px] py-1 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-slate-300 truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/25 px-1.5 py-0.5 rounded-full">
                        {user?.role?.replace('_', ' ')}
                      </span>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all" onClick={() => setShowUserMenu(false)}>
                        <Shield className="w-3.5 h-3.5 text-slate-400" /> Admin Dashboard
                      </Link>
                    )}
                    {isManager && (
                      <Link to="/manager" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all" onClick={() => setShowUserMenu(false)}>
                        <Fuel className="w-3.5 h-3.5 text-slate-400" /> Station Dashboard
                      </Link>
                    )}
                    <button
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                      onClick={() => { 
                        logout(); 
                        setShowUserMenu(false); 
                        navigate('/');
                        setShowLogin(true);
                      }}
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-login"
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-amber-500/20"
                onClick={() => setShowLogin(true)}
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={switchToRegister} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSwitchToLogin={switchToLogin} />}
    </>
  );
}
