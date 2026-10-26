import React, { useState, useEffect } from 'react';

function Navbar({ activeSection, onNavigate }) {
  const [current, setCurrent] = useState(activeSection || 'home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleClick = (id) => {
    setCurrent(id);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-logo">SP</span>
        <div className="brand-text">
          <span className="brand-name">Hari Bhavsar</span>
          <span className="brand-id">ID: 24CS009</span>
        </div>
      </div>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-link-btn ${current === item.id ? 'active' : ''}`}
              onClick={() => handleClick(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="nav-badge">
        <span className="badge-tag">ITUE301 | PR-1</span>
      </div>
    </nav>
  );
}

export default Navbar;
