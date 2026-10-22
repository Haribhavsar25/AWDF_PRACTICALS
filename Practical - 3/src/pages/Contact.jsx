import React, { useState } from 'react';

function Contact({ studentEmail }) {
  // 1. Controlled form input states using useState
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // 2. Second useState variable: Toggle visibility of help tooltip (Lab Requirement #6)
  const [showTooltip, setShowTooltip] = useState(false);

  // Submission feedback state
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="page-container">
      <section className="portfolio-section">
        <div className="section-title-row">
          <div>
            <h2 className="section-title">Contact Page (/contact Route)</h2>
            <p className="section-desc">
              Demonstrating controlled inputs, reactive state management, and real-time UI feedback.
            </p>
          </div>

          {/* Toggle Help Tooltip (useState UI visibility requirement) */}
          <button 
            type="button" 
            className="tooltip-toggle-btn"
            onClick={() => setShowTooltip(!showTooltip)}
          >
            {showTooltip ? '✖ Hide Help' : '💡 Help & Instructions'}
          </button>
        </div>

        {/* Toggled Help Box */}
        {showTooltip && (
          <div className="help-box">
            <strong>State Management Guide (Practical 2):</strong>
            <p>
              Every keystroke in the input fields triggers an <code>onChange</code> event handler, updating the React component state via <code>useState()</code>. The input value is bound to state (controlled component), enabling real-time live preview and instant character counting.
            </p>
          </div>
        )}

        <div className="contact-grid">
          {/* Controlled Form */}
          <div className="form-card">
            <h3>Send a Message (Controlled Form)</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name-input">Your Name:</label>
                <input
                  id="name-input"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email-input">Your Email:</label>
                <input
                  id="email-input"
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message-input">Message / Feedback:</label>
                <textarea
                  id="message-input"
                  rows="4"
                  className="form-control"
                  placeholder="Type your message here to observe real-time state updates..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                {/* Live Character Count (Supplementary Requirement) */}
                <div className="char-counter">
                  Characters: <strong>{message.length}</strong> / 200
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Submit Feedback
                </button>
                <button type="button" onClick={handleReset} className="btn btn-secondary">
                  Reset Form
                </button>
              </div>
            </form>

            {submitted && (
              <div className="success-banner">
                ✔ State Successfully Captured! Thank you, <strong>{name}</strong>.
              </div>
            )}
          </div>

          {/* Real-Time State Preview Card */}
          <div className="preview-card">
            <h3>Live State Preview (React useState)</h3>
            <p className="preview-desc">
              Values update instantaneously as you type without page reload:
            </p>
            <div className="preview-item">
              <span className="preview-label">Name State:</span>
              <span className="preview-value">{name || '(awaiting input...)'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Email State:</span>
              <span className="preview-value">{email || '(awaiting input...)'}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Message State:</span>
              <p className="preview-box">{message || '(type in the box to view real-time state)'}</p>
            </div>
            <div className="preview-item">
              <span className="preview-label">Live Character Count:</span>
              <span className="badge-count">{message.length} characters</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
