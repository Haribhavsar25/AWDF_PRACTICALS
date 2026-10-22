import React from 'react';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-icon">🗑️</span>
          <h3 className="modal-title">{title || 'Confirm Deletion'}</h3>
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="btn btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
