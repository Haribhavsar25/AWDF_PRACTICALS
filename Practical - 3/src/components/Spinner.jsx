import React from 'react';

function Spinner({ message = "Loading repositories from GitHub API..." }) {
  return (
    <div className="spinner-container">
      <div className="spinner-circle"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
}

export default Spinner;
