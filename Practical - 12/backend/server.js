/**
 * Practical 12: CI/CD Pipeline with GitHub Actions
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Task = require('./models/Task');
const { cache, recordHit, recordMiss, recordInvalidation, getStats } = require('./cache');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_cicd_db';

app.use(cors());
app.use(express.json());

// Request logger with timing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const cacheHeader = res.getHeader('X-Cache') || 'N/A';
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms) [Cache: ${cacheHeader}]`);
    }
  });
  next();
});

// Connect to MongoDB only if not in test mode or URI is specified
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB connected successfully');
      console.log(`Database URI: ${MONGO_URI}`);
    })
    .catch((err) => {
      console.warn('MongoDB connection warning:', err.message);
    });
}

// In-memory fallback dataset for isolated testing/CI environments
let inMemoryTasks = [
  { _id: '6715f1a20000000000000001', title: 'Setup GitHub Actions CI/CD workflow', priority: 'high', completed: true },
  { _id: '6715f1a20000000000000002', title: 'Write automated Jest unit and API integration tests', priority: 'high', completed: true },
  { _id: '6715f1a20000000000000003', title: 'Configure ESLint code style validation job', priority: 'medium', completed: false }
];

// Health & Info Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'ITUE301 Practical 12: CI/CD Pipeline with GitHub Actions',
    student: 'Hari Bhavsar (24CS009)',
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'In-Memory / CI Mode',
    pipeline: 'GitHub Actions Automated Testing'
  });
});

// Health check endpoint for CI/CD pipeline verification
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Cache Stats Endpoint
app.get('/cache-stats', (req, res) => {
  res.status(200).json({
    success: true,
    stats: getStats()
  });
});

// GET /tasks: Retrieve tasks with caching & DB/memory fallback
app.get('/tasks', async (req, res, next) => {
  try {
    const cacheKey = 'all_tasks';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      recordHit();
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedData);
    }

    recordMiss();
    let tasks;
    if (mongoose.connection.readyState === 1) {
      tasks = await Task.find().sort({ createdAt: -1 });
    } else {
      tasks = inMemoryTasks;
    }

    cache.set(cacheKey, tasks, 60);
    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id: Retrieve single task
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `task_${id}`;
    const cachedTask = cache.get(cacheKey);

    if (cachedTask) {
      recordHit();
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedTask);
    }

    recordMiss();
    let task;
    if (mongoose.connection.readyState === 1) {
      task = await Task.findById(id);
    } else {
      task = inMemoryTasks.find((t) => t._id === id);
    }

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    cache.set(cacheKey, task, 60);
    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// POST /tasks: Create task with input validation & cache invalidation
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, priority, completed } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Validation Error: Title is required and cannot be empty.' });
    }

    let newTask;
    if (mongoose.connection.readyState === 1) {
      newTask = await Task.create({
        title: title.trim(),
        priority: priority || 'medium',
        completed: Boolean(completed)
      });
    } else {
      newTask = {
        _id: `mock_${Date.now()}`,
        title: title.trim(),
        priority: priority || 'medium',
        completed: Boolean(completed),
        createdAt: new Date().toISOString()
      };
      inMemoryTasks.unshift(newTask);
    }

    // Invalidate collection cache
    cache.del('all_tasks');
    recordInvalidation('all_tasks');

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id: Delete task
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
    } else {
      const idx = inMemoryTasks.findIndex((t) => t._id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }
      inMemoryTasks.splice(idx, 1);
    }

    cache.del('all_tasks');
    cache.del(`task_${id}`);
    recordInvalidation(`all_tasks and task_${id}`);

    res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (err) {
    next(err);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Server error:', err.message);
  }
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
