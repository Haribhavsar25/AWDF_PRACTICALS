import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask, getMe, getToken, setToken } from '../api/api';

function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks();
      setTasks(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createTask({ title, priority });
      setTasks([res.data, ...tasks]);
      setTitle('');
      setPriority('medium');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (task) => {
    try {
      const res = await updateTask(task._id, { completed: !task.completed });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Demonstrate Supplementary Problem 2: simulate expired token
  const handleSimulateExpiredToken = () => {
    setToken('invalid_or_expired_jwt_token_sample');
    fetchTasks(); // triggers 401 and auto redirect to /login?expired=true
  };

  return (
    <div className="tasks-dashboard">
      <div className="auth-status-banner">
        <div>
          <h3>🛡️ Protected Tasks Dashboard (JWT Verified)</h3>
          <p>
            Authenticated as: <strong>{user ? user.email : 'Loading...'}</strong>
            {user && <span> (ID: <code>{user.id}</code>)</span>}
          </p>
        </div>
        <button
          className="btn btn-warning btn-sm"
          onClick={handleSimulateExpiredToken}
          title="Corrupt token to test 401 handling"
        >
          Simulate Token Expiry (401 Redirect)
        </button>
      </div>

      {error && <div className="alert-danger">⚠️ {error}</div>}

      <form onSubmit={handleAddTask} className="task-create-card">
        <h4>➕ Create New Protected Task</h4>
        <div className="form-inline-row">
          <input
            type="text"
            className="form-input flex-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement refresh token rotation"
            required
            minLength={3}
          />
          <select
            className="form-select flex-1"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Task'}
          </button>
        </div>
      </form>

      <div className="task-list">
        {loading ? (
          <div className="loading-state">Loading your tasks from MongoDB...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks created yet for this account. Create one above!</div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`task-row ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={Boolean(task.completed)}
                onChange={() => handleToggle(task)}
              />
              <div className="task-body">
                <span className="task-title">{task.title}</span>
                <div className="task-tags">
                  <span className={`tag tag-${task.priority}`}>{task.priority.toUpperCase()}</span>
                  <code>ID: {task._id}</code>
                </div>
              </div>
              <button className="btn-del" onClick={() => handleDelete(task._id)}>
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
