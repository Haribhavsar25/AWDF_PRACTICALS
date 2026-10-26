import React from 'react';

function Footer() {
  const repoUrl = 'https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%207.git';

  return (
    <footer className="footer-bar">
      <div className="footer-inner">
        <div>
          <h4>Hari Bhavsar (24CS009)</h4>
          <p>Practical 7: JWT Authentication & Middleware Pipeline | ITUE301</p>
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
