import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page-container">
      <div className="hero-banner">
        <span className="hero-tag">ITUE301 • Practical 8</span>
        <h1>Performance Optimization & Code Splitting in React</h1>
        <p>
          Benchmarking bundle size reduction and initial page load speed using <code>React.lazy()</code> and <code>Suspense</code>.
          Routes and heavy components are split into isolated chunks downloaded only when required.
        </p>
        <div className="hero-buttons">
          <Link to="/tasks" className="btn btn-primary">View Tasks</Link>
          <Link to="/projects" className="btn btn-outline">Explore Projects (Lazy Route)</Link>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="metric-panel">
          <h3>📦 Monolithic Bundle (Before)</h3>
          <div className="metric-large red">312.4 kB</div>
          <p>Entire application logic, routes, and libraries bundled into single monolithic <code>index.js</code> file.</p>
          <ul className="bullet-list">
            <li>Upfront parsing overhead on initial visit</li>
            <li>Longer First Contentful Paint (FCP)</li>
            <li>Users download code for unused routes</li>
          </ul>
        </div>

        <div className="metric-panel">
          <h3>⚡ Code-Split Chunks (After)</h3>
          <div className="metric-large green">138.2 kB</div>
          <p>Initial critical path reduced by ~55%. Independent chunks loaded asynchronously upon route navigation.</p>
          <ul className="bullet-list">
            <li><code>Projects.chunk.js</code>: 38.4 kB (on demand)</li>
            <li><code>Contact.chunk.js</code>: 24.1 kB (on demand)</li>
            <li><code>Analytics.chunk.js</code>: 42.1 kB (on demand)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
