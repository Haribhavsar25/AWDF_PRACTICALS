/**
 * Practical 5: MongoDB Integration and Schema Design with Mongoose
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar * Academic Year: 2026-27 | Semester: 5th
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
// 1. Built-in & Third-party Middleware
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// 2. Global Request Logging Middleware
// ==========================================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// 3. Connect to MongoDB using Mongoose
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

// Welcome / API Documentation Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Task Manager API with MongoDB & Mongoose (Practical 5)',
    student: 'Hari Bhavsar (24CS009)',
    database: 'MongoDB (Mongoose ODM)',
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
    endpoints: {
      getAllTasks: 'GET /tasks',
      getTaskById: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      seedSampleData: 'POST /tasks/seed'
    }
  });
});

// ==========================================
// 4. RESTful CRUD Endpoints with Mongoose
// ==========================================

// GET /tasks -> Retrieve all tasks from MongoDB (Status: 200 OK)
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

// GET /tasks/:id -> Supplementary Problem 3: Retrieve single task by MongoDB _id (Status: 200 OK or 404 Not Found)
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
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

// POST /tasks -> Create a new task document with Schema validation (Status: 201 Created or 400 Bad Request)
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
    next(err); // Forward to centralized error handler for structured validation error formatting
  }
});

// PUT /tasks/:id -> Update an existing task document (Status: 200 OK or 404 Not Found)
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid task ID format '${id}'. Expected 24-character hexadecimal ObjectId.`
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: 'after', // Return updated document in Mongoose 8
        runValidators: true // Enforce Mongoose schema validation on update
      }
    );

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

// DELETE /tasks/:id -> Delete a task document from MongoDB (Status: 200 OK or 404 Not Found)
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

// POST /tasks/seed -> Helper to populate initial sample task documents
app.post('/tasks/seed', async (req, res, next) => {
  try {
    await Task.deleteMany({});
    const initialTasks = [
      {
        title: 'Complete Practical 1 - React Portfolio App',
        description: 'Component architecture and state fundamentals',
        completed: true,
        priority: 'high'
      },
      {
        title: 'Complete Practical 2 - React Router & State Management',
        description: 'Client-side routing and controlled input state',
        completed: true,
        priority: 'medium'
      },
      {
        title: 'Complete Practical 3 - GitHub REST API Integration',
        description: 'Asynchronous fetch, loading spinner, error retry, and search',
        completed: true,
        priority: 'high'
      },
      {
        title: 'Complete Practical 4 - Express REST API & Middleware Pipeline',
        description: 'REST CRUD endpoints, request logging, and global error handling',
        completed: true,
        priority: 'medium'
      },
      {
        title: 'Complete Practical 5 - MongoDB Integration & Mongoose Schema Validation',
        description: 'NoSQL document persistence, schema constraints, and enum validation',
        completed: false,
        priority: 'high'
      }
    ];

    const created = await Task.insertMany(initialTasks);
    res.status(201).json({
      success: true,
      message: 'Sample tasks seeded successfully in MongoDB database',
      count: created.length,
      data: created
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 5. Undefined Routes 404 Handler
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
// 6. Centralized Global Error Handler
// ==========================================
// Formats Mongoose ValidationErrors and CastErrors into structured JSON
app.use((err, req, res, next) => {
  console.error('[ERROR]:', err.message);

  // Mongoose Validation Error (required fields, enum mismatch, minlength)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      validationErrors: messages
    });
  }

  // Mongoose Invalid ObjectId Cast Error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Cast Error',
      message: `Invalid format for field '${err.path}': value '${err.value}' is not a valid ObjectId`
    });
  }

  // Generic 500 Server Error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

// ==========================================
// 7. Start Server
// ==========================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ready to accept REST client requests at http://localhost:${PORT}`);
  });
}

module.exports = app;
