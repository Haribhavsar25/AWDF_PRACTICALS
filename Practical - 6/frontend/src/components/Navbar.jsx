import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-name">Hari Bhavsar</span>
          <span className="brand-id">24CS009</span>
        </div>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Tasks (Full Stack CRUD)
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Contact
            </NavLink>
          </li>
        </ul>

        <div className="nav-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <span className="practical-badge">ITUE301 | PR-6</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
