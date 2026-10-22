import React from 'react';

function Spinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
      {message && <p className="spinner-text">{message}</p>}
    </div>
  );
}

export default Spinner;
