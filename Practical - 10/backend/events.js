/**
 * Practical 10: Centralized Event Emitter Module
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS057 | Name: Shubham Pansuriya
 */

const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

// Instantiate single shared EventEmitter instance
const taskEvents = new TaskEvents();

module.exports = taskEvents;
