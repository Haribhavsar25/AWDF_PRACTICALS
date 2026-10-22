import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page-container notfound-container">
      <div className="notfound-card">
        <span className="notfound-code">404</span>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-desc">
          The route you navigated to does not exist. React Router caught this path via the wildcard <code>path="*"</code> route.
        </p>
        <Link to="/" className="btn btn-primary">
          &larr; Return to Home Route
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
