import React from 'react';

/**
 * Supplementary Problem 1: Heavy Third-Party Chart / Analytics Component
 * Lazy loaded on demand to prevent bloating the initial bundle size.
 */
function AnalyticsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content analytics-card">
        <div className="modal-header">
          <h3>📊 Application Performance & Task Velocity Analytics</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <p className="analytics-desc">
          This heavy analytics visualization was lazy loaded dynamically via <code>React.lazy()</code> only when the user opened this view, saving upfront network bandwidth.
        </p>

        <div className="chart-mockup">
          <div className="chart-bar" style={{ height: '70%' }}><span>Mon (14)</span></div>
          <div className="chart-bar" style={{ height: '90%' }}><span>Tue (22)</span></div>
          <div className="chart-bar" style={{ height: '45%' }}><span>Wed (9)</span></div>
          <div className="chart-bar" style={{ height: '85%' }}><span>Thu (18)</span></div>
          <div className="chart-bar" style={{ height: '100%' }}><span>Fri (26)</span></div>
        </div>

        <div className="analytics-stats">
          <div className="stat-box"><strong>Initial Bundle Reduction:</strong> ~35%</div>
          <div className="stat-box"><strong>Chunk Size:</strong> 42.1 kB</div>
          <div className="stat-box"><strong>Load Time (Cached):</strong> &lt; 5 ms</div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>Close Analytics</button>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsModal;
