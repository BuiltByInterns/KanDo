const request = require('supertest');
const express = require('express');

let app;

beforeAll(() => {
  app = express();
});

describe('Basic Server', () => {
  it('should respond to GET / with 404 (no routes defined)', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(404);
  });
});