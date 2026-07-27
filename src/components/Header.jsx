import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header id="main-header" className="h-16 bg-slate-900 border-b border-slate-800 z-50 backdrop-blur-md flex-shrink-0">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight transition hover:opacity-85">
          <span className="text-2xl">⛽</span>
          <span className="text-slate-100">
            FuelFinder <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-sm font-bold ml-1">NG</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            id="nav-home"
            className={`font-semibold text-sm px-3 py-1.5 rounded-lg transition-all ${
              pathname === '/' 
                ? 'text-slate-100 bg-slate-800' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            Map View
          </Link>
          <a
            id="nav-report"
            href="#report"
            className="hidden sm:inline-block bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            + Report Update
          </a>
        </nav>
      </div>
    </header>
  );
}
