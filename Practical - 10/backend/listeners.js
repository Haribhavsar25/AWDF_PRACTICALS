/**
 * Practical 10: Asynchronous Event Listeners
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const taskEvents = require('./events');

// 1. Task Created Listener (with simulated background notification worker delay)
taskEvents.on('task-created', (task) => {
  const receiveTime = new Date().toISOString();
  console.log(`[Event:task-created] Received at: ${receiveTime} | Task: "${task.title}"`);

  // Simulate slow asynchronous background processing (e.g., sending email / push notification)
  setTimeout(() => {
    try {
      const finishTime = new Date().toISOString();
      console.log(`[Notification Worker] Background dispatch completed at: ${finishTime}`);
      console.log(`[Notification Details] Title: "${task.title}" | Assigned: ${task.assignedUser} | Priority: ${task.priority.toUpperCase()}`);
    } catch (err) {
      taskEvents.emit('error', err);
    }
  }, 2000); // 2000ms artificial delay to clearly demonstrate non-blocking execution
});

// 2. Supplementary Problem 1: Task Deleted Listener
taskEvents.on('task-deleted', (data) => {
  const timestamp = new Date().toISOString();
  console.log(`[Event:task-deleted] Triggered at: ${timestamp} | Task ID: ${data.id} ("${data.title}")`);
  console.log(`[Audit Trail] Soft-archive record logged for user ${data.assignedUser || 'Hari Bhavsar (24CS009)'}`);
});

// 3. Supplementary Problem 2: Error Event Listener
taskEvents.on('error', (err) => {
  const timestamp = new Date().toISOString();
  console.error(`[Event:error] Handled event exception at ${timestamp}: ${err.message}`);
  // Catching error event prevents unhandled exception crashes in Node.js
});

console.log('[Events] All event listeners registered: task-created, task-deleted, error');
