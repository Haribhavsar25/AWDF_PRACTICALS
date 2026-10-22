import React from 'react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3 className="error-title">API Request Failed</h3>
        <p className="error-text">
          {message || "Unable to fetch repositories from the remote server. Please check your network connection or verify the endpoint URL."}
        </p>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-retry">
            🔄 Retry Request
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
