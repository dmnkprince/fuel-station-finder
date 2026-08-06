import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header id="main-header" className="mb-0.5 h-14 bg-re-900 border-b border-slate-800 z-50 backdrop-blur-md shrink-0 flex items-center">
      <div className="w-full   h-full px-4 sm:px-6 flex items-center justify-between">
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
          <Link
            to="/"
            id="nav-home"
            className={`font-semibold text-sm px-2 py-1 rounded-lg transition-all ${
              pathname === "/" ? "text-slate-100 bg-slate-800" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            Map View
          </Link>
          <Link
            to="/about"
            id="nav-about"
            className={`font-semibold text-sm px-2 py-1 rounded-lg transition-all ${
              pathname === "/about" ? "text-slate-100 bg-slate-800" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            About
          </Link>
          <a
            id="nav-report"
            href="#report"
            className="hidden sm:inline-block bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs px-3 py-1 rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            + Report Update
          </a>
        </nav>
      </div>
    </header>
  );
}
