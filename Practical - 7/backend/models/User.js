/**
 * Practical 7: User Model (MongoDB & Mongoose Schema)
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
