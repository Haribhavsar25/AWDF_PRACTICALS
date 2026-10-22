import React from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../api/api';

function Home() {
  const token = getToken();

  return (
    <div className="home-hero">
      <span className="hero-pill">ITUE301 • Practical 7</span>
      <h1>JWT Authentication & Middleware Pipeline</h1>
      <p className="hero-desc">
        A secure Express.js architecture implementing bcrypt password hashing, JSON Web Token (JWT) issuance,
        route-protecting authentication middleware, and server-side request input validation.
      </p>

      <div className="hero-actions">
        {token ? (
          <Link to="/tasks" className="btn btn-primary btn-lg">Go to Protected Tasks 🚀</Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary btn-lg">Sign In 🔐</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Register Account 📝</Link>
          </>
        )}
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="f-icon">🔒</div>
          <h3>Bcrypt Password Hashing</h3>
          <p>Passwords are never stored in plain text. Salted with work factor 10 before saving to MongoDB.</p>
        </div>
        <div className="feature-card">
          <div className="f-icon">🎫</div>
          <h3>JWT Access Tokens</h3>
          <p>Signed using <code>process.env.JWT_SECRET</code> with 1-hour expiration and user ID payload.</p>
        </div>
        <div className="feature-card">
          <div className="f-icon">🛡️</div>
          <h3>Auth & Validation Middleware</h3>
          <p>Express pipeline verifying Bearer tokens and validating payload integrity before database access.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
