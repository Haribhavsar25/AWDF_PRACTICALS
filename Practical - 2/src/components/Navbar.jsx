import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar({ darkMode, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/" className="brand-link">
          <span className="brand-name">Shubham Pansuriya</span>
          <span className="brand-id">24CS057</span>
        </NavLink>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            Contact
          </NavLink>
        </li>
      </ul>

      <div className="nav-actions">
        <button 
          onClick={onToggleTheme} 
          className="theme-toggle-btn"
          title="Toggle Dark / Light Mode"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <span className="nav-badge">ITUE301 | PR-2</span>
      </div>
    </nav>
  );
}

export default NavBar;
