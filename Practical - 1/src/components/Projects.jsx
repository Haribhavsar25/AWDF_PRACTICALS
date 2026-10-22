import React from 'react';

function Projects({ projectList }) {
  return (
    <section id="projects" className="portfolio-section">
      <h2 className="section-title">Projects</h2>
      <p className="section-desc">Key academic projects passed via props</p>

      <div className="projects-grid">
        {projectList && projectList.map((project, idx) => (
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
                View Project &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
