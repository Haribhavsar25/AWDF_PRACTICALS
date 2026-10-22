import React, { useState } from 'react';

function Projects({ projectList }) {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Full Stack Web App', 'React & Vite Scaffolding', 'Hackathon Project'];

  const filteredProjects = filter === 'All' 
    ? projectList 
    : projectList.filter((p) => p.category === filter);

  return (
    <div className="page-container">
      <section className="portfolio-section">
        <h2 className="section-title">Projects Page (/projects Route)</h2>
        <p className="section-desc">
          Rendered dynamically via client-side routing using React Router v6.
        </p>

        {/* Category Filter buttons using useState */}
        <div className="filter-bar">
          <span className="filter-label">Filter Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects && filteredProjects.map((project, idx) => (
            <div key={project.id || idx} className="project-card">
              <span className="project-badge">{project.category}</span>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tech">
                {project.tech && project.tech.map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-link"
                >
                  View Repository &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Projects;
