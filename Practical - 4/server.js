/**
 * Practical 4: Building a RESTful API with Node.js and Express
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS057 | Name: Shubham Pansuriya
 * Academic Year: 2026-27 | Semester: 5th
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Core Built-in & Third-party Middleware
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// 2. Global Request Logging Middleware
// ==========================================
// Logs method, URL, and ISO timestamp for every incoming request
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// 3. Supplementary Middleware: Content-Type Checker
// ==========================================
// Rejects POST and PUT requests that lack application/json header
const checkContentType = (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request: Content-Type must be application/json'
      });
    }
  }
  next();
};

// ==========================================
// 4. Supplementary Middleware: Task ID Validator
// ==========================================
// Validates that :id parameter is a positive integer before hitting controller
const validateTaskId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: `Invalid task ID format '${req.params.id}'. ID must be a positive integer.`
    });
  }
  req.taskId = id;
  next();
};

// ==========================================
// 5. In-Memory Data Store (Tasks)
// ==========================================
let tasks = [
  { id: 1, title: 'Complete Practical 1 - React Portfolio App', completed: true, createdAt: '2026-10-18T10:00:00.000Z' },
  { id: 2, title: 'Complete Practical 2 - React Router & State Management', completed: true, createdAt: '2026-10-19T14:30:00.000Z' },
  { id: 3, title: 'Complete Practical 3 - GitHub REST API Integration', completed: true, createdAt: '2026-10-21T09:15:00.000Z' },
  { id: 4, title: 'Complete Practical 4 - Express REST API & Middleware', completed: false, createdAt: '2026-10-21T18:00:00.000Z' }
];

// Server Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Task Manager RESTful API (ITUE301 - Practical 4)',
    student: 'Shubham Pansuriya (24CS057)',
    version: '1.0.0',
    endpoints: {
      getAllTasks: 'GET /tasks',
      getTaskById: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      simulateError: 'GET /simulate-error'
    }
  });
});

// ==========================================
// 6. REST CRUD Endpoints
// ==========================================

// GET /tasks -> Retrieve all tasks (Status: 200 OK)
app.get('/tasks', (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// GET /tasks/:id -> Retrieve a single task by ID (Status: 200 OK or 404 Not Found)
app.get('/tasks/:id', validateTaskId, (req, res) => {
  const task = tasks.find((t) => t.id === req.taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${req.taskId} not found`
    });
  }
  res.status(200).json({
    success: true,
    data: task
  });
});

// POST /tasks -> Create a new task (Status: 201 Created or 400 Bad Request)
app.post('/tasks', checkContentType, (req, res) => {
  const { title, completed } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: "Task 'title' is required and must be a non-empty string"
    });
  }

  const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const newTask = {
    id: nextId,
    title: title.trim(),
    completed: Boolean(completed),
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask
  });
});

// PUT /tasks/:id -> Update an existing task (Status: 200 OK, 400 Bad Request, or 404 Not Found)
app.put('/tasks/:id', validateTaskId, checkContentType, (req, res) => {
  const task = tasks.find((t) => t.id === req.taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${req.taskId} not found`
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: "Task 'title' must be a non-empty string"
      });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    task.completed = Boolean(completed);
  }

  task.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: `Task ${req.taskId} updated successfully`,
    data: task
  });
});

// DELETE /tasks/:id -> Delete a task (Status: 200 OK or 404 Not Found)
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.taskId);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${req.taskId} not found`
    });
  }

  const deleted = tasks.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: `Task ${req.taskId} deleted successfully`,
    deletedTask: deleted
  });
});

// GET /simulate-error -> Deliberate error endpoint to verify global error handler
app.get('/simulate-error', (req, res, next) => {
  try {
    throw new Error('Deliberate internal server error caught by global error middleware pipeline');
  } catch (err) {
    next(err); // Forward error to the global error handling middleware
  }
});

// ==========================================
// 7. Supplementary: 404 Handler for Undefined Routes
// ==========================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requestedPath: req.originalUrl,
    method: req.method
  });
});

// ==========================================
// 8. Global Error Handling Middleware
// ==========================================
// Must have 4 arguments (err, req, res, next) and be defined as the very last middleware
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR HANDLER]:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

// ==========================================
// 9. Start Server
// ==========================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ready to accept REST client requests at http://localhost:${PORT}`);
  });
}

module.exports = app;
