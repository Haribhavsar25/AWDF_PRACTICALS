/**
 * Practical 6: Task Model (MongoDB & Mongoose Schema)
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters long']
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: "'{VALUE}' is not a valid priority. Permitted: low, medium, or high."
      },
      default: 'medium',
      lowercase: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook automatically sanitizing whitespace
taskSchema.pre('save', function () {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
});

module.exports = mongoose.model('Task', taskSchema);
