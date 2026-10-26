/**
 * Practical 11: Containerization with Docker and Docker Compose
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
// In Docker Compose, the MongoDB container is accessible via service name 'mongodb'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/taskdb';

app.use(cors());
app.use(express.json());

// Request logger with timing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const cacheHeader = res.getHeader('X-Cache') || 'N/A';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms) [Cache: ${cacheHeader}]`);
  });
  next();
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log(`Database URI: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Health & Info Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'ITUE301 Practical 9: In-Memory Caching & Query Optimization',
    student: 'Hari Bhavsar (24CS009)',
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    cacheStatus: 'Active (node-cache)',
    ttlSeconds: process.env.CACHE_TTL || 60
  });
});

// Supplementary Problem 2: Cache Telemetry / Stats Debug Endpoint
app.get('/cache-stats', (req, res) => {
  res.status(200).json({
    success: true,
    stats: getStats()
  });
});

// ==========================================
// Caching CRUD Endpoints
// ==========================================

// GET /tasks -> In-memory cached query
app.get('/tasks', async (req, res, next) => {
  try {
    const cacheKey = 'all_tasks';
    const cachedTasks = cache.get(cacheKey);

    if (cachedTasks) {
      recordHit();
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json({
        success: true,
        source: 'cache (in-memory)',
        count: cachedTasks.length,
        data: cachedTasks
      });
    }

    // Cache Miss -> Query MongoDB
    recordMiss();
    const tasks = await Task.find().sort({ createdAt: -1 });

    // Store in node-cache
    cache.set(cacheKey, tasks);

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({
      success: true,
      source: 'database (mongodb)',
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id -> Single-task separate cache (Supplementary Problem 1)
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }

    const cacheKey = `task_${id}`;
    const cachedTask = cache.get(cacheKey);

    if (cachedTask) {
      recordHit();
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json({
        success: true,
        source: 'cache (in-memory)',
        data: cachedTask
      });
    }

    recordMiss();
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    cache.set(cacheKey, task);
    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({
      success: true,
      source: 'database (mongodb)',
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks -> Write operation -> Cache Invalidation
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const task = await Task.create({ title, description, completed, priority });

    // Invalidate all_tasks cache to maintain data correctness
    cache.del('all_tasks');
    recordInvalidation();
    console.log('[Cache] Invalidated key: all_tasks due to POST write');

    res.status(201).json({
      success: true,
      message: 'Task created and cache invalidated',
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id -> Update operation -> Cache Invalidation
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }

    const task = await Task.findByIdAndUpdate(id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Invalidate both all_tasks and specific task cache
    cache.del('all_tasks');
    cache.del(`task_${id}`);
    recordInvalidation();
    console.log(`[Cache] Invalidated keys: all_tasks & task_${id} due to PUT update`);

    res.status(200).json({
      success: true,
      message: 'Task updated and cache invalidated',
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id -> Delete operation -> Cache Invalidation
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid task ID format' });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    cache.del('all_tasks');
    cache.del(`task_${id}`);
    recordInvalidation();
    console.log(`[Cache] Invalidated keys: all_tasks & task_${id} due to DELETE operation`);

    res.status(200).json({
      success: true,
      message: 'Task deleted and cache invalidated',
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// Seed endpoint for performance testing
app.post('/tasks/seed', async (req, res, next) => {
  try {
    await Task.deleteMany({});
    cache.flushAll();

    const sample = [
      { title: 'Evaluate Cache Hit/Miss latency difference', priority: 'high', completed: true },
      { title: 'Benchmark MongoDB query response times without cache', priority: 'high', completed: true },
      { title: 'Test cache invalidation on PUT and DELETE write operations', priority: 'medium', completed: false },
      { title: 'Verify cache-stats telemetry endpoint metrics', priority: 'low', completed: false }
    ];

    const tasks = await Task.insertMany(sample);
    res.status(201).json({
      success: true,
      message: 'Database seeded and cache flushed',
      count: tasks.length
    });
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Caching server listening on http://localhost:${PORT}`);
});
