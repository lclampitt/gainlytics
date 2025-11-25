// src/components/header.jsx
import { Link, useLocation } from 'react-router-dom';
import './header.css';

export default function Header({ onLogout, session }) {
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Analyzer', path: '/analyzer' },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Goal Planner', path: '/goalplanner' },
    { label: 'Progress', path: '/progress' },
  ];

  return (
    <header className="header">
      <div className="header-logo">
        <h1>Gainlytics</h1>
      </div>

      <nav className="header-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {session && (
            <li>
              <button onClick={onLogout} className="logout-btn">
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
