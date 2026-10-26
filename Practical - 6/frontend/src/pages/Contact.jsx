import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2 className="contact-title">Contact & Student Information</h2>
        <p className="contact-desc">
          For inquiries or academic review of Practical 6 (ITUE301 Advanced Web Development Frameworks).
        </p>

        <div className="student-profile-badge">
          <div className="profile-avatar">SP</div>
          <div>
            <h3>Hari Bhavsar</h3>
            <p>B.Tech Computer Science & Engineering | ID: <strong>24CS009</strong></p>
            <p>Faculty of Technology and Engineering, CHARUSAT</p>
          </div>
        </div>

        {submitted ? (
          <div className="alert-box alert-success">
            ✅ Thank you! Your message has been received locally.
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-msg">Message</label>
              <textarea
                id="contact-msg"
                className="form-input"
                rows="4"
                placeholder="Write your feedback or message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
