/**
 * Practical 8: Express Backend Server
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Analyze initial bundle size with npm run build', completed: true, priority: 'high' },
      { id: 2, title: 'Implement React.lazy() and Suspense on route components', completed: true, priority: 'high' },
      { id: 3, title: 'Lazy load heavy Analytics chart modal (Supplementary 1)', completed: true, priority: 'medium' },
      { id: 4, title: 'Profile and memoize TaskItem with React.memo (Supplementary 3)', completed: true, priority: 'medium' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
