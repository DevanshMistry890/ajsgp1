const request = require('supertest');
const app = require('../index'); // Make sure to export app from index.js

const sampleTask = {
  description: 'Test task',
  assignedTo: 'John Doe',
  dueDate: '2024-12-31',
  priority: 'high',
  status: 'in progress',
};

describe('Task API Tests', () => {
  let server;
  let createdTask;

  beforeAll((done) => {
    server = app.listen(3001, () => {
      console.log('Test server started on port 3001');
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  // Test POST /api/tasks
  test('POST /api/tasks should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send(sampleTask)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toMatchObject(sampleTask);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();

    createdTask = response.body; // Store for other tests
  });

  // Test GET /api/tasks
  test('GET /api/tasks should return all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(1);
  });

  // Test GET /api/tasks/:id
  test('GET /api/tasks/:id should return a specific task', async () => {
    const response = await request(app)
      .get(`/api/tasks/${createdTask.id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toMatchObject(sampleTask);
  });

  // Test PUT /api/tasks/:id
  test('PUT /api/tasks/:id should update a task', async () => {
    const updatedTask = {
      ...sampleTask,
      description: 'Updated test task',
      status: 'in progress',
    };

    const response = await request(app)
      .put(`/api/tasks/${createdTask.id}`)
      .send(updatedTask)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toMatchObject(updatedTask);
    expect(response.body.updatedAt).toBeDefined();
  });

  // Test DELETE /api/tasks/:id
  test('DELETE /api/tasks/:id should delete a task', async () => {
    await request(app).delete(`/api/tasks/${createdTask.id}`).expect(204);

    // Verify task is deleted
    await request(app).get(`/api/tasks/${createdTask.id}`).expect(404);
  });

  // Test GET /api/tasks/search
  test('GET /api/tasks/search should return filtered tasks', async () => {
    await request(app).post('/api/tasks').send(sampleTask).expect(201);

    // Test search by description
    const response = await request(app)
      .get('/api/tasks/search?query=Test')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].description).toContain('Test');

    // Test empty query returns all tasks
    const allTasksResponse = await request(app)
      .get('/api/tasks/search')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(allTasksResponse.body)).toBeTruthy();
  });

  // Test error cases for GET /api/tasks/:id
  test('GET /api/tasks/:id should return 404 for non-existent task', async () => {
    await request(app).get('/api/tasks/999999').expect(404);
  });

  // Test error cases for PUT /api/tasks/:id
  test('PUT /api/tasks/:id should return 404 for non-existent task', async () => {
    await request(app).put('/api/tasks/999999').send(sampleTask).expect(404);
  });

  // Test error cases for DELETE /api/tasks/:id
  test('DELETE /api/tasks/:id should return 404 for non-existent task', async () => {
    await request(app).delete('/api/tasks/999999').expect(404);
  });

  // Test validation for POST /api/tasks
  test('POST /api/tasks should validate required fields', async () => {
    const invalidTask = {
      description: 'Missing required fields',
    };

    await request(app).post('/api/tasks').send(invalidTask).expect(400);
  });
});

// Test validation for POST /api/tasks
describe('Task Validation Tests', () => {
  const invalidPriorityTask = {
    ...sampleTask,
    priority: 'invalid_priority',
  };

  const invalidStatusTask = {
    ...sampleTask,
    status: 'invalid_status',
  };

  const invalidDateTask = {
    ...sampleTask,
    dueDate: 'invalid-date',
  };

  test('should reject task with invalid priority', async () => {
    await request(app).post('/api/tasks').send(invalidPriorityTask).expect(400);
  });

  test('should reject task with invalid status', async () => {
    await request(app).post('/api/tasks').send(invalidStatusTask).expect(400);
  });

  test('should reject task with invalid date format', async () => {
    await request(app).post('/api/tasks').send(invalidDateTask).expect(400);
  });
});
