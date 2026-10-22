import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function Projects() {
  // 1. Core State Variables (Practical 3 Requirement)
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Search/Filter state (Supplementary Requirement)
  const [searchTerm, setSearchTerm] = useState('');

  // 3. GitHub Username
  const username = '24cs057shubham';

  // Function to fetch repositories
  const fetchRepos = (triggerError = false) => {
    setLoading(true);
    setError(null);

    // If triggerError is true, simulate error with an invalid endpoint
    const url = triggerError
      ? 'https://api.github.com/users/invalid-nonexistent-user-404/repos'
      : `https://api.github.com/users/${username}/repos`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API Error: HTTP ${res.status} (${res.statusText})`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          setRepos([]);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to communicate with GitHub REST API.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Trigger fetch on component mount using useEffect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mock') === 'loading') {
      setLoading(true);
      return;
    }
    if (params.get('mock') === 'error') {
      setLoading(false);
      setError('GitHub API Error: HTTP 404 (Not Found) - Simulated network failure to test ErrorMessage component.');
      return;
    }
    if (params.get('search')) {
      setSearchTerm(params.get('search'));
    }
    fetchRepos();
  }, []);

  // Filter repositories dynamically by name
  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <section className="portfolio-section">
        <div className="section-title-row">
          <div>
            <h2 className="section-title">GitHub Repositories (API Integration)</h2>
            <p className="section-desc">
              Live data dynamically consumed from <code>api.github.com/users/{username}/repos</code> using <code>useEffect()</code> and <code>fetch()</code>.
            </p>
          </div>

          {/* Test Error Simulation Button */}
          <div className="api-actions">
            <button 
              onClick={() => fetchRepos(false)} 
              className="btn btn-secondary"
              title="Re-fetch live data"
            >
              🔄 Refresh Data
            </button>
            <button 
              onClick={() => fetchRepos(true)} 
              className="btn btn-simulate-error"
              title="Simulate network failure to test ErrorMessage & Retry"
            >
              ⚠️ Test Error State
            </button>
          </div>
        </div>

        {/* Search Input Filter (Supplementary Requirement) */}
        {!loading && !error && (
          <div className="repo-search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search repositories by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="btn-clear-search">
                ✕ Clear
              </button>
            )}
            <span className="repo-count-badge">
              Showing {filteredRepos.length} of {repos.length} Repositories
            </span>
          </div>
        )}

        {/* 1. Loading State */}
        {loading && <Spinner message="Fetching live repositories from GitHub REST API..." />}

        {/* 2. Error State with Retry Button */}
        {!loading && error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => fetchRepos(false)} 
          />
        )}

        {/* 3. Success State - Render Repository Cards */}
        {!loading && !error && (
          <div className="repo-grid">
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo) => (
                <div key={repo.id} className="repo-card">
                  <div className="repo-header">
                    <h3 className="repo-name">
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="repo-link"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    {/* Star Count Badge (Supplementary Requirement) */}
                    <span className="star-badge" title="GitHub Stars">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>

                  <p className="repo-desc">
                    {repo.description || 'Public academic development repository for coursework.'}
                  </p>

                  <div className="repo-meta-row">
                    <span className="lang-tag">
                      ● {repo.language || 'JavaScript'}
                    </span>
                    <span className="fork-count">
                      🍴 {repo.forks_count} forks
                    </span>
                    <span className="visibility-tag">
                      {repo.visibility || 'public'}
                    </span>
                  </div>

                  <div className="repo-footer">
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-repo-link"
                    >
                      View on GitHub &rarr;
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-repos-box">
                <p>No repositories found matching "<strong>{searchTerm}</strong>".</p>
                <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                  Reset Search
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Projects;
