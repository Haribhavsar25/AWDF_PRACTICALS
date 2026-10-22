/**
 * Practical 6: Express Backend Server with MongoDB Integration & CORS
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS057 | Name: Shubham Pansuriya
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_manager_db';

// ==========================================
// 1. CORS & Body Parser Middlewares
// ==========================================
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// 2. Connect to MongoDB
// ==========================================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log(`Database connected at: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Welcome / Health Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Manager Backend API (Practical 6 - Full Stack Integration)',
    student: 'Shubham Pansuriya (24CS057)',
    database: 'MongoDB (Mongoose ODM)',
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
    endpoints: {
      getTasks: 'GET /tasks',
      getTaskById: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      seedSampleData: 'POST /tasks/seed'
    }
  });
});

// ==========================================
// 3. RESTful CRUD Endpoints for React UI
// ==========================================

// GET /tasks -> Retrieve all tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id -> Retrieve a single task by ID
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid task ID format '${id}'. Expected 24-character hexadecimal ObjectId.`
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with ID ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks -> Create a new task
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;
    const newTask = await Task.create({
      title,
      description,
      completed,
      priority
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully in MongoDB',
      data: newTask
    });
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id -> Update task status or fields
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid task ID format '${id}'. Expected 24-character hexadecimal ObjectId.`
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: `Task not found with ID ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully in MongoDB',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id -> Delete task from MongoDB
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid task ID format '${id}'. Expected 24-character hexadecimal ObjectId.`
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: `Task not found with ID ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully from MongoDB',
      deletedTask
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks/seed -> Seed initial data
app.post('/tasks/seed', async (req, res, next) => {
  try {
    await Task.deleteMany({});
    const initialTasks = [
      {
        title: 'Review Course Material for ITUE301',
        description: 'Read Week 6 IBM full-stack development lecture notes',
        completed: true,
        priority: 'high'
      },
      {
        title: 'Implement React Frontend with Centralized API',
        description: 'Configure api.js with BASE_URL pointing to Express backend',
        completed: true,
        priority: 'high'
      },
      {
        title: 'Connect React State to MongoDB CRUD Operations',
        description: 'Ensure create, toggle, and delete update persistent database',
        completed: false,
        priority: 'high'
      },
      {
        title: 'Add Toast Notifications and Delete Confirmation Modal',
        description: 'Implement optimistic UI updates and interactive UX feedback',
        completed: false,
        priority: 'medium'
      }
    ];

    const created = await Task.insertMany(initialTasks);
    res.status(201).json({
      success: true,
      message: 'Initial tasks seeded successfully in MongoDB database',
      count: created.length,
      data: created
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 4. Undefined Route 404 Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requestedPath: req.originalUrl,
    method: req.method
  });
});

// ==========================================
// 5. Centralized Error Handler
// ==========================================
app.use((err, req, res, next) => {
  console.error('[ERROR]:', err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      validationErrors: messages
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Cast Error',
      message: `Invalid format for field '${err.path}': value '${err.value}' is not a valid ObjectId`
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
    console.log(`CORS enabled for frontend origin http://localhost:5173`);
  });
}

module.exports = app;
