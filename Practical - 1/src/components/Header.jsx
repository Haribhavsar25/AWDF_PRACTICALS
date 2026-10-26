import React from 'react';

function Header({ name, studentId, courseTitle, subtitle, themeColor }) {
  const headerStyle = {
    borderLeftColor: themeColor || '#2563eb'
  };

  return (
    <header id="home" className="hero-header" style={headerStyle}>
      <span className="header-tag" style={{ color: themeColor || '#2563eb' }}>
        Practical 1 : React & Component Architecture
      </span>
      <h1 className="header-title">
        {name}
      </h1>
      <p className="header-meta">
        Student ID: <strong>{studentId}</strong> &nbsp;|&nbsp; Academic Year: <strong>2026-27</strong> &nbsp;|&nbsp; Semester: <strong>5th</strong>
      </p>
      <p className="header-meta">
        Subject: <strong>{courseTitle}</strong>
      </p>
      <p className="header-subtitle">{subtitle}</p>
      
      <div className="header-actions">
        <a href="#about" className="btn btn-primary" style={{ backgroundColor: themeColor || '#2563eb', borderColor: themeColor || '#2563eb' }}>
          Explore Portfolio
        </a>
        <a 
          href="https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%201.git" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-secondary"
        >
          GitHub Repository &rarr;
        </a>
      </div>
    </header>
  );
}

export default Header;
