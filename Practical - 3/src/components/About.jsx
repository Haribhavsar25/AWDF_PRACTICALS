import React from 'react';

function About({ bio, education, department, institution }) {
  return (
    <section id="about" className="portfolio-section">
      <h2 className="section-title">About Me</h2>
      <p className="section-desc">Academic background and student overview</p>

      <div className="about-grid">
        <div className="about-card">
          <h3>Profile Summary</h3>
          <p>{bio}</p>
        </div>

        <div className="about-card">
          <h3>Academic Information</h3>
          <ul className="edu-list">
            <li><strong>Degree:</strong> {education}</li>
            <li><strong>Department:</strong> {department}</li>
            <li><strong>Institution:</strong> {institution}</li>
            <li><strong>Semester:</strong> 5th Semester (2026-27)</li>
            <li><strong>Subject:</strong> ITUE301 - AWDF</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
