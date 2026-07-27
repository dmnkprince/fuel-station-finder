import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header id="main-header" className="header-bar">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-icon">⛽</span>
          <span className="logo-text">FuelFinder <span className="logo-ng">NG</span></span>
        </Link>

        <nav className="header-nav">
          <Link
            to="/"
            id="nav-home"
            className={`nav-link ${pathname === '/' ? 'nav-link--active' : ''}`}
          >
            Map
          </Link>
          <a
            id="nav-report"
            href="#report"
            className="nav-cta"
          >
            + Report Update
          </a>
        </nav>
      </div>
    </header>
  );
}
