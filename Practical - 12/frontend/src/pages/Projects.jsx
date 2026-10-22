import React from 'react';

function Projects() {
  const projectList = [
    { id: 1, title: 'AWDF Full-Stack Monorepo', stack: 'React 18 + Express + MongoDB', desc: 'Enterprise microservices and full-stack task integration.' },
    { id: 2, title: 'JWT Authentication Gateway', stack: 'Node.js + Bcrypt + JWT', desc: 'High-security middleware pipeline with token rotation.' },
    { id: 3, title: 'Distributed Event Pipeline', stack: 'EventEmitter + Async Workers', desc: 'Asynchronous event streaming and decoupled task triggers.' },
    { id: 4, title: 'Dockerized Cloud Deployment', stack: 'Docker + Docker Compose', desc: 'Multi-container orchestration and automated bridge networking.' }
  ];

  return (
    <div className="page-container">
      <h2>🚀 Academic Projects Showcase (Lazy-Loaded Chunk)</h2>
      <p className="page-sub">
        This route was downloaded dynamically over the network as <code>Projects-*.js</code> only when you clicked this tab.
      </p>

      <div className="projects-grid">
        {projectList.map((p) => (
          <div key={p.id} className="project-card">
            <h3>{p.title}</h3>
            <span className="project-stack">{p.stack}</span>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
