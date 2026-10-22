const request = require('supertest');
const app = require('../server');

describe('Task Management API Test Suite (CI/CD Pipeline)', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('GET /health', () => {
    it('should return 200 OK and health status for pipeline liveness check', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /tasks', () => {
    it('should return 200 OK and a list of tasks', async () => {
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /tasks', () => {
    it('should successfully create a new task and return 201 Created', async () => {
      const newTask = {
        title: 'Verify GitHub Actions CI Workflow Execution',
        priority: 'high',
        completed: false
      };
      const res = await request(app).post('/tasks').send(newTask);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', newTask.title);
      expect(res.body).toHaveProperty('priority', newTask.priority);
      expect(res.body).toHaveProperty('completed', false);
    });

    it('should reject malformed request without title and return 400 Bad Request', async () => {
      const invalidTask = {
        priority: 'low'
      };
      const res = await request(app).post('/tasks').send(invalidTask);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return 404 Not Found for a non-existent task ID', async () => {
      const res = await request(app).get('/tasks/non_existent_id_999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });
  });
});
