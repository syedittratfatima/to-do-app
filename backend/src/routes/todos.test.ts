import request from 'supertest';
import { createApp } from '../app.js';
import { pool } from '../db.js';

jest.mock('../db.js', () => ({
  pool: { query: jest.fn() },
}));

const mockPoolQuery = pool.query as jest.MockedFunction<typeof pool.query>;

it('updates todo completion status', async () => {
  mockPoolQuery.mockResolvedValueOnce({
    rowCount: 1,
    rows: [{ id: 1, text: 'Test todo', completed: true }],
  } as any);

  const app = createApp();
  const res = await request(app)
    .put('/todos/1')
    .send({ completed: true });

  expect(res.status).toBe(200);
  expect(res.body).toEqual({
    id: 1,
    text: 'Test todo',
    completed: true,
  });
  expect(mockPoolQuery).toHaveBeenCalledWith(
    'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING id, text, completed',
    [true, 1],
  );
});
