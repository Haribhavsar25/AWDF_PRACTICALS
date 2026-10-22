import React from 'react';

function Footer() {
  const repoUrl = 'https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%208.git';

  return (
    <footer className="footer-bar">
      <div className="footer-inner">
        <div>
          <h4>Shubham Pansuriya (24CS057)</h4>
          <p>Practical 8: Performance Optimization & Lazy Loading in React | ITUE301</p>
        </div>
        <div>
          <a href={repoUrl} target="_blank" rel="noreferrer" className="footer-repo">
            GitHub: {repoUrl}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
