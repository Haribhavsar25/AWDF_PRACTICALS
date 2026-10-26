import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../api/api';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    clearToken();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-name">Hari Bhavsar</span>
          <span className="brand-id">24CS009</span>
        </div>

        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          {token && <li><NavLink to="/tasks">Protected Tasks</NavLink></li>}
        </ul>

        <div className="nav-auth-actions">
          {token && user ? (
            <div className="user-profile-badge">
              <span className="user-email-text">👤 {user.email}</span>
              <button className="btn-logout" onClick={handleLogout} title="Clear JWT Token">
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-links">
              <NavLink to="/login" className="btn btn-outline btn-sm">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink>
            </div>
          )}
          <span className="practical-badge">ITUE301 | PR-7</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
