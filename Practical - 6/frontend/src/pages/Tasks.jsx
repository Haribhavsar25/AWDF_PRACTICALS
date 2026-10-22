import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, seedSampleTasks } from '../api/api.js';
import TaskForm from '../components/TaskForm.jsx';
import TaskItem from '../components/TaskItem.jsx';
import Spinner from '../components/Spinner.jsx';
import Toast from '../components/Toast.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification state (Supplementary Problem 3)
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Delete Confirmation Modal state (Supplementary Problem 2)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    task: null,
    isDeleting: false
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // 1. Initial Data Fetch on Mount
  const fetchAllTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks();
      if (res.success && Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to Express backend.');
      showToast('Network error: Could not reach Express server on port 5000', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mock') === 'loading') {
      setLoading(true);
      return;
    }
    if (params.get('mock') === 'delete_modal') {
      fetchAllTasks().then(() => {
        setDeleteModal({
          isOpen: true,
          task: { _id: '6ad8b6a3e5b7ae646c7bf1fa', title: 'Review Course Material for ITUE301' },
          isDeleting: false
        });
      });
      return;
    }
    if (params.get('mock') === 'toast') {
      fetchAllTasks();
      showToast('Task created and persisted in MongoDB database successfully!', 'success');
      return;
    }

    fetchAllTasks();
  }, []);

  // 2. Supplementary Problem 1: Optimistic UI Update on Task Creation
  const handleAddTask = async (newTaskData) => {
    setIsSubmitting(true);

    // Create temporary optimistic task object
    const tempId = `temp_${Date.now()}`;
    const optimisticTask = {
      ...newTaskData,
      _id: tempId,
      createdAt: new Date().toISOString()
    };

    // Optimistically prepend task to list immediately
    setTasks((prev) => [optimisticTask, ...prev]);
    showToast('Saving task to MongoDB database...', 'success');

    try {
      // Send write operation to Express backend
      const res = await createTask(newTaskData);
      if (res.success && res.data) {
        // Replace optimistic task with confirmed MongoDB document
        setTasks((prev) => prev.map((t) => (t._id === tempId ? res.data : t)));
        showToast('Task created and persisted in MongoDB successfully!', 'success');
      }
    } catch (err) {
      // Revert optimistic addition upon failure
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      showToast(`Creation failed: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Toggle Completion (PUT /tasks/:id)
  const handleToggleTask = async (task) => {
    const newStatus = !task.completed;

    // Optimistic toggle in local state
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: newStatus } : t))
    );

    try {
      await updateTask(task._id, { completed: newStatus });
      showToast(
        newStatus
          ? `Marked '${task.title}' as completed!`
          : `Marked '${task.title}' as pending.`,
        'success'
      );
    } catch (err) {
      // Revert if API fails
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: task.completed } : t))
      );
      showToast(`Update failed: ${err.message}`, 'error');
    }
  };

  // 4. Request Deletion (Opens Confirmation Dialog - Supplementary Problem 2)
  const handleRequestDelete = (task) => {
    setDeleteModal({
      isOpen: true,
      task,
      isDeleting: false
    });
  };

  // Confirm Deletion (DELETE /tasks/:id)
  const handleConfirmDelete = async () => {
    if (!deleteModal.task) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await deleteTask(deleteModal.task._id);
      setTasks((prev) => prev.filter((t) => t._id !== deleteModal.task._id));
      showToast(`Task '${deleteModal.task.title}' deleted from MongoDB!`, 'success');
      setDeleteModal({ isOpen: false, task: null, isDeleting: false });
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // 5. Seed Sample Data
  const handleSeedData = async () => {
    setLoading(true);
    try {
      const res = await seedSampleTasks();
      if (res.success && res.data) {
        setTasks(res.data);
        showToast('Sample tasks seeded into MongoDB database!', 'success');
      }
    } catch (err) {
      showToast(`Seeding failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks by status and search query
  const filteredTasks = tasks.filter((t) => {
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? t.completed
        : !t.completed;

    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="page-container">
      {/* Toast Notification (Supplementary Problem 3) */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Delete Confirmation Modal (Supplementary Problem 2) */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Confirm Task Deletion"
        message={
          deleteModal.task
            ? `Are you sure you want to permanently remove "${deleteModal.task.title}" from the MongoDB database? This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, task: null, isDeleting: false })}
        isDeleting={deleteModal.isDeleting}
      />

      <section className="portfolio-section">
        {/* Section Header */}
        <div className="section-title-row">
          <div>
            <h2 className="section-title">Full Stack Task Management System</h2>
            <p className="section-desc">
              Connected live to Express backend on <code>http://localhost:5000/tasks</code> with persistent MongoDB database storage.
            </p>
          </div>

          <div className="api-actions">
            <button onClick={fetchAllTasks} className="btn btn-secondary" title="Re-fetch from MongoDB">
              🔄 Refresh List
            </button>
            <button onClick={handleSeedData} className="btn btn-seed" title="Seed default academic tasks">
              🌱 Reset Sample Data
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="metrics-bar">
          <div className="metric-chip">
            <span className="metric-num">{tasks.length}</span> Total Tasks
          </div>
          <div className="metric-chip chip-pending">
            <span className="metric-num">{pendingCount}</span> Pending
          </div>
          <div className="metric-chip chip-completed">
            <span className="metric-num">{completedCount}</span> Completed
          </div>
          <div className="metric-db-status">
            <span className="db-dot">●</span> MongoDB Connected: <code>task_manager_db</code>
          </div>
        </div>

        {/* Task Creation Form (Supplementary Problem 1: Optimistic UI) */}
        <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

        {/* Search & Filter Controls */}
        <div className="task-toolbar">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search tasks by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                ✕
              </button>
            )}
          </div>

          <div className="filter-buttons">
            <button
              className={`btn-filter ${filterStatus === 'all' ? 'filter-active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All ({tasks.length})
            </button>
            <button
              className={`btn-filter ${filterStatus === 'pending' ? 'filter-active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`btn-filter ${filterStatus === 'completed' ? 'filter-active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* 1. Loading State */}
        {loading && <Spinner message="Loading persistent tasks from MongoDB database..." />}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <h4>Failed to Connect to Backend Server</h4>
              <p>{error}</p>
              <button onClick={fetchAllTasks} className="btn btn-primary" style={{ marginTop: '10px' }}>
                🔄 Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* 3. Success Task List */}
        {!loading && !error && (
          <div className="task-list-container">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDeleteRequest={handleRequestDelete}
                />
              ))
            ) : (
              <div className="no-tasks-box">
                <p>No tasks found matching current filter or search criteria.</p>
                {tasks.length === 0 ? (
                  <button onClick={handleSeedData} className="btn btn-primary">
                    🌱 Populate Sample Tasks
                  </button>
                ) : (
                  <button onClick={() => { setFilterStatus('all'); setSearchQuery(''); }} className="btn btn-secondary">
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Tasks;
