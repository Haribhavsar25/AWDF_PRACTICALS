import React from 'react';

function TaskItem({ task, onToggle, onDeleteRequest }) {
  const isOptimistic = task._id && task._id.startsWith('temp_');

  return (
    <div className={`task-card ${task.completed ? 'task-completed' : ''} ${isOptimistic ? 'task-optimistic' : ''}`}>
      <div className="task-checkbox-col">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={Boolean(task.completed)}
          onChange={() => onToggle(task)}
          disabled={isOptimistic}
          title="Toggle completion status"
        />
      </div>

      <div className="task-info-col">
        <div className="task-top-row">
          <h4 className="task-title-text">
            {task.title}
            {isOptimistic && <span className="optimistic-badge">⏳ Saving...</span>}
          </h4>
          <span className={`priority-tag priority-${task.priority || 'medium'}`}>
            {task.priority ? task.priority.toUpperCase() : 'MEDIUM'}
          </span>
        </div>

        {task.description && <p className="task-desc-text">{task.description}</p>}

        <div className="task-meta-row">
          <span className="task-id-text">
            <code>ID: {task._id}</code>
          </span>
          <span className="task-date-text">
            📅 {new Date(task.createdAt || Date.now()).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="task-action-col">
        <button
          type="button"
          onClick={() => onDeleteRequest(task)}
          className="btn-delete"
          title="Delete task from MongoDB"
          disabled={isOptimistic}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
