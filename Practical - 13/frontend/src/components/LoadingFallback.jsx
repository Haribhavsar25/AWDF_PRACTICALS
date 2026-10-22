import React from 'react';

function LoadingFallback({ message = 'Loading lazy component chunk...' }) {
  return (
    <div className="lazy-fallback-container">
      <div className="lazy-spinner"></div>
      <p className="lazy-text">{message}</p>
      <span className="lazy-subtext">React Suspense fallback active</span>
    </div>
  );
}

export default LoadingFallback;
