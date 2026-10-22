import React, { useState } from 'react';

function TaskForm({ onAddTask, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form className="task-form-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3 className="form-title">➕ Create New Task (MongoDB Write)</h3>
        <span className="form-subtitle">Enforces Mongoose schema validation & pre-save trim hook</span>
      </div>

      <div className="form-row">
        <div className="form-group flex-2">
          <label htmlFor="task-title">Task Title *</label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g. Implement JWT Authentication with Refresh Tokens"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            required
            minLength={3}
          />
        </div>

        <div className="form-group flex-1">
          <label htmlFor="task-priority">Priority (Enum)</label>
          <select
            id="task-priority"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="task-desc">Description (Optional)</label>
        <input
          id="task-desc"
          type="text"
          className="form-input"
          placeholder="Brief details about the task implementation requirements..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? 'Saving to MongoDB...' : 'Save Task to Database'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
