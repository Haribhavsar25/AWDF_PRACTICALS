import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, setToken } from '../api/api';

function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerUser(email, password);
      setToken(res.token);
      setUser(res.user);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <h2>📝 Register Account</h2>
        <p className="auth-subtitle">Passwords are hashed using bcrypt before saving to MongoDB</p>

        {error && <div className="alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="24cs009@charusat.edu.in"
              required
            />
          </div>

          <div className="form-group">
            <label>Password (Min 6 chars)</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register & Auto-Login'}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
