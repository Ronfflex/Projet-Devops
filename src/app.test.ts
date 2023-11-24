import * as request from 'supertest';
import * as express from "express";
import { connect } from 'mongoose';

jest.mock('./controllers');
jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

import { launchAPI } from './app';

describe('API launch tests', () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    await launchAPI();
  });

  it('should respond to a GET request at /api', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
  });

});

