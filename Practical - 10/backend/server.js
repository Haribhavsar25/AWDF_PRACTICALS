/**
 * Practical 10: Express Server with Event-Driven Architecture
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS057 | Name: Shubham Pansuriya
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Task = require('./models/Task');
const taskEvents = require('./events');
// Register all event listeners on server startup
require('./listeners');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_events_db';

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
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

// Root Health
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'ITUE301 Practical 10: Asynchronous Processing with Event-Driven Architecture',
    student: 'Shubham Pansuriya (24CS057)',
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    registeredEvents: ['task-created', 'task-deleted', 'error']
  });
});

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

// POST /tasks -> Create task and emit asynchronous event
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, priority, assignedUser } = req.body;

    // 1. Save to MongoDB
    const task = await Task.create({
      title,
      description,
      priority,
      assignedUser: assignedUser || 'Shubham Pansuriya (24CS057)'
    });

    // 2. Respond immediately to the client (Critical Non-Blocking Requirement)
    const responseTimestamp = new Date().toISOString();
    console.log(`[API] Response sent at: ${responseTimestamp}`);
    res.status(201).json({
      success: true,
      message: 'Task created successfully (Background processing queued)',
      responseSentAt: responseTimestamp,
      data: task
    });

    // 3. Emit asynchronous background event AFTER response is sent
    taskEvents.emit('task-created', task);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id -> Delete task and emit task-deleted event (Supplementary 1)
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

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      deletedId: id
    });

    // Emit task-deleted event asynchronously
    taskEvents.emit('task-deleted', { id, title: task.title, assignedUser: task.assignedUser });
  } catch (err) {
    next(err);
  }
});

// POST /tasks/trigger-error -> Test error event listener (Supplementary 2)
app.post('/tasks/trigger-error', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Triggered custom error event. Check console output.'
  });

  taskEvents.emit('error', new Error('Simulated event worker failure - Caught by taskEvents.on("error")'));
});

// Seed endpoint
app.post('/tasks/seed', async (req, res, next) => {
  try {
    await Task.deleteMany({});
    const sample = [
      { title: 'Evaluate EventEmitter timestamp ordering', priority: 'high', assignedUser: 'Shubham Pansuriya' },
      { title: 'Simulate background notification worker delay', priority: 'medium', assignedUser: 'Shubham Pansuriya' }
    ];
    const tasks = await Task.insertMany(sample);
    res.status(201).json({ success: true, count: tasks.length });
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
