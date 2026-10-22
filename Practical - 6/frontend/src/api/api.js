/**
 * Centralized API Service for Practical 6 Full Stack Integration
 * Base URL connects to Express backend running on http://localhost:5000
 */

const BASE_URL = 'http://localhost:5000';

// 1. Fetch all tasks from MongoDB
export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: HTTP ${res.status}`);
  }
  return res.json();
};

// 2. Fetch single task by ID
export const getTaskById = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Task not found with ID: ${id}`);
  }
  return res.json();
};

// 3. Create a new task (POST /tasks)
export const createTask = async (taskData) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  const data = await res.json();
  if (!res.ok) {
    const errMsg = data.validationErrors
      ? data.validationErrors.join(', ')
      : data.error || `HTTP ${res.status} error`;
    throw new Error(errMsg);
  }
  return data;
};

// 4. Update task (PUT /tasks/:id)
export const updateTask = async (id, updateData) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to update task: HTTP ${res.status}`);
  }
  return data;
};

// 5. Delete task (DELETE /tasks/:id)
export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to delete task: HTTP ${res.status}`);
  }
  return data;
};

// 6. Seed sample data
export const seedSampleTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks/seed`, {
    method: 'POST'
  });
  return res.json();
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  seedSampleTasks
};
