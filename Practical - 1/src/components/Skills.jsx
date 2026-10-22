import React from 'react';

function Skills({ skillList }) {
  return (
    <section id="skills" className="portfolio-section">
      <h2 className="section-title">Technical Skills</h2>
      <p className="section-desc">Dynamically mapped from props array (Practical 1 Requirement)</p>

      <ul className="skills-grid">
        {skillList && skillList.map((skill) => (
          <li key={typeof skill === 'object' ? skill.name : skill} className="skill-card">
            <span className="skill-name">
              {typeof skill === 'object' ? skill.name : skill}
            </span>
            {typeof skill === 'object' && skill.level && (
              <span className="skill-level">{skill.level}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
