import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="badge-chip">ITUE301 • Practical 6</div>
        <h1 className="hero-title">Full Stack Task Management System</h1>
        <p className="hero-subtitle">
          Seamlessly wiring a modern React 18 frontend with an Express.js REST API and MongoDB database.
          Featuring CORS integration, optimistic UI rendering, interactive modal confirmation, and real-time toast feedback.
        </p>
        <div className="hero-buttons">
          <Link to="/tasks" className="btn btn-primary btn-large">
            Launch Task Manager (CRUD) 🚀
          </Link>
          <a
            href="https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%206.git"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-large"
          >
            GitHub Repository 📂
          </a>
        </div>
      </section>

      <section className="architecture-grid">
        <div className="arch-card">
          <div className="arch-icon">⚛️</div>
          <h3>React 18 Frontend</h3>
          <p>
            Vite-powered single-page application hosted on port <code>5173</code>. Manages synchronized local component state, optimistic updates, and central HTTP service.
          </p>
        </div>

        <div className="arch-card">
          <div className="arch-icon">⚡</div>
          <h3>Express.js REST API</h3>
          <p>
            Node.js backend hosted on port <code>5000</code> configured with <code>cors</code> middleware, structured RESTful CRUD routing, and unified error handling.
          </p>
        </div>

        <div className="arch-card">
          <div className="arch-icon">🍃</div>
          <h3>MongoDB Database</h3>
          <p>
            Persistent document database managed via Mongoose 8 schema with strict validation rules, priority enumerations, and pre-save hooks.
          </p>
        </div>
      </section>

      <section className="highlights-box">
        <h3>✨ Practical 6 Key Architectural Capabilities</h3>
        <ul className="highlights-list">
          <li><strong>Cross-Origin Resource Sharing (CORS):</strong> Backend cleanly configured with <code>app.use(cors())</code> to accept cross-origin requests from the Vite dev server.</li>
          <li><strong>Optimistic UI Updates (Supplementary 1):</strong> Instant client-side state reflection on task addition with temporary IDs, replaced seamlessly upon 201 response.</li>
          <li><strong>Delete Confirmation Dialog (Supplementary 2):</strong> Accessible custom modal dialog preventing accidental database deletions.</li>
          <li><strong>Interactive Toast Feedback (Supplementary 3):</strong> Real-time animated toast alerts reporting success and failure for all write operations.</li>
          <li><strong>Data Persistence:</strong> Full database synchronicity across browser reloads verified through direct MongoDB storage.</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
