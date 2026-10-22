import React from 'react';

function Footer({ studentName, studentId, email, repoUrl }) {
  return (
    <footer id="contact" className="portfolio-footer">
      <div className="footer-content">
        <div className="footer-col">
          <h4>{studentName}</h4>
          <p>
            B.Tech Computer Science & Engineering undergraduate at CHARUSAT.
          </p>
        </div>

        <div className="footer-col">
          <h4>Academic Details</h4>
          <ul>
            <li><strong>Student ID:</strong> {studentId}</li>
            <li><strong>Subject:</strong> ITUE301 - AWDF</li>
            <li><strong>Practical:</strong> 1</li>
            <li><strong>Year:</strong> 2026-27 (5th Semester)</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Repository & Contact</h4>
          <ul>
            <li>
              <strong>GitHub Repo:</strong><br />
              <a 
                href={repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="repo-link"
              >
                {repoUrl}
              </a>
            </li>
            <li><strong>Email:</strong> {email}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {studentName} ({studentId}). Charotar University of Science and Technology (CHARUSAT).</p>
      </div>
    </footer>
  );
}

export default Footer;
