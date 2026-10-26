/**
 * Practical 7: Server-side Request Input Validation Middleware
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const validateTask = (req, res, next) => {
  const { title, priority } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Task title is required and cannot be empty');
  } else if (title.trim().length < 3) {
    errors.push('Task title must be at least 3 characters long');
  }

  if (priority && !['low', 'medium', 'high'].includes(priority.toLowerCase())) {
    errors.push(`Invalid priority '${priority}'. Allowed values are: low, medium, high`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Input validation failed',
      validationErrors: errors
    });
  }

  next();
};

const validateAuth = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Authentication validation failed',
      validationErrors: errors
    });
  }

  next();
};

module.exports = {
  validateTask,
  validateAuth
};
