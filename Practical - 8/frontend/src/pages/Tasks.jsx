import React, { useState, useCallback, useMemo } from 'react';

/**
 * Supplementary Problem 3: React.memo on TaskItem
 * Prevents redundant re-renders when other parent component state changes.
 */
const TaskItem = React.memo(function TaskItem({ task, onToggle, onDelete }) {
  console.log(`[Profiler] Rendering TaskItem: ${task.title}`);

  return (
    <div className={`task-row ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={Boolean(task.completed)}
        onChange={() => onToggle(task.id)}
      />
      <div className="task-content">
        <span className="task-name">{task.title}</span>
        <span className={`badge badge-${task.priority}`}>{task.priority.toUpperCase()}</span>
      </div>
      <button className="btn-del" onClick={() => onDelete(task.id)}>🗑️</button>
    </div>
  );
});

function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Analyze initial bundle size with npm run build', completed: true, priority: 'high' },
    { id: 2, title: 'Implement React.lazy() and Suspense on route components', completed: true, priority: 'high' },
    { id: 3, title: 'Lazy load heavy Analytics chart modal (Supplementary 1)', completed: true, priority: 'medium' },
    { id: 4, title: 'Profile and memoize TaskItem with React.memo (Supplementary 3)', completed: true, priority: 'medium' }
  ]);
  const [counter, setCounter] = useState(0);

  const handleToggle = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const handleDelete = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completedCount = useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  return (
    <div className="page-container">
      <div className="tasks-header">
        <div>
          <h2>⚡ Task Management (Profiler & Memoization Active)</h2>
          <p className="page-sub">
            Supplementary 3: <code>React.memo</code> and <code>useCallback</code> prevent unnecessary child re-renders.
          </p>
        </div>
        <div className="profiler-control">
          <span>Unrelated State Trigger:</span>
          <button className="btn btn-outline btn-sm" onClick={() => setCounter((c) => c + 1)}>
            Increment Counter ({counter})
          </button>
        </div>
      </div>

      <div className="metrics-chip-bar">
        <span>Total: <strong>{tasks.length}</strong></span>
        <span>Completed: <strong>{completedCount}</strong></span>
        <span>Pending: <strong>{tasks.length - completedCount}</strong></span>
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default Tasks;
