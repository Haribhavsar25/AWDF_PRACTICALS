/**
 * Practical 5: Task Model & Mongoose Schema Design
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // 1. Core Required Field
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters long']
    },

    // 2. Optional Description
    description: {
      type: String,
      default: '',
      trim: true
    },

    // 3. Boolean Status with Default false
    completed: {
      type: Boolean,
      default: false
    },

    // 4. Supplementary Problem 1: Priority Enum Field
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: "'{VALUE}' is not a valid priority. Permitted values are 'low', 'medium', or 'high'."
      },
      default: 'medium',
      lowercase: true
    },

    // 5. Creation Timestamp
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

// Supplementary Problem 2: Pre-save hook that automatically trims whitespace
taskSchema.pre('save', function () {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
});

module.exports = mongoose.model('Task', taskSchema);
