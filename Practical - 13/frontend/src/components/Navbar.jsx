import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ onOpenAnalytics }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-name">Hari Bhavsar</span>
          <span className="brand-id">24CS009</span>
        </div>

        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/tasks">Tasks</NavLink></li>
          <li><NavLink to="/projects">Projects (Lazy)</NavLink></li>
          <li><NavLink to="/contact">Contact (Lazy)</NavLink></li>
        </ul>

        <div className="nav-actions">
          <button className="btn-analytics" onClick={onOpenAnalytics} title="Lazy-load Analytics Component">
            ⚡ Open Analytics
          </button>
          <span className="practical-badge">ITUE301 | PR-8</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
