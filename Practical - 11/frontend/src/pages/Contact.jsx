import React, { useState } from 'react';

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="page-container">
      <h2>📬 Contact & Feedback (Lazy-Loaded Chunk)</h2>
      <p className="page-sub">
        Separated from the main bundle to keep initial page downloads fast and responsive.
      </p>

      <div className="contact-card">
        {sent ? (
          <div className="alert-success">✅ Feedback received successfully!</div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" placeholder="Shubham Pansuriya" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-input" placeholder="shubham@charusat.edu.in" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-input" rows="4" placeholder="Your review of Practical 8 performance improvements..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
