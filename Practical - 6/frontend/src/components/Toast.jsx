import React, { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`toast-container ${isSuccess ? 'toast-success' : 'toast-error'}`}>
      <span className="toast-icon">{isSuccess ? '✅' : '⚠️'}</span>
      <span className="toast-text">{message}</span>
      <button onClick={onClose} className="toast-close-btn" title="Dismiss">
        ✕
      </button>
    </div>
  );
}

export default Toast;
