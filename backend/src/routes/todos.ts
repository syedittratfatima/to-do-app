import { Router } from 'express';
import { z, ZodError } from 'zod';
import { pool } from '../db.js';

const router = Router();

const createSchema = z.object({
  text: z.string().trim().min(1).max(255),
});

const updateSchema = z.object({
  completed: z.boolean(),
});

const handleDbError = (error: unknown, next: (error: unknown) => void) => {
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as { code: string; message: string; detail?: string };
    
    switch (dbError.code) {
      case 'ECONNREFUSED':
      case 'ENOTFOUND':
        console.error('Database connection error:', dbError.message);
        return next(new Error('Database connection failed. Please check if the database server is running.'));
      
      case '28P01':
        console.error('Database authentication error:', dbError.message);
        return next(new Error('Database authentication failed. Please check your credentials.'));
      
      case '3D000':
        console.error('Database not found:', dbError.message);
        return next(new Error('Database not found. Please create the database first.'));
      
      case '42P01':
        console.error('Table not found:', dbError.message);
        return next(new Error('Table not found. Please run the database migrations.'));
      
      case '23505':
        return next(new Error('A todo with this information already exists.'));
      
      case '23503':
        return next(new Error('Invalid reference. The requested resource does not exist.'));
      
      default:
        console.error('Database error:', dbError.code, dbError.message);
        return next(new Error(`Database error: ${dbError.message || 'An unexpected error occurred'}`));
    }
  }
  
  console.error('Unexpected error:', error);
  next(error);
};

router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT id, text, completed FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    handleDbError(error, next);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { text } = createSchema.parse(req.body);
    const result = await pool.query(
      'INSERT INTO todos (text, completed) VALUES ($1, false) RETURNING id, text, completed',
      [text],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(error);
    }
    handleDbError(error, next);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { completed } = updateSchema.parse(req.body);
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid id. Must be a positive number.' });
    }

    const result = await pool.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING id, text, completed',
      [completed, id],
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(error);
    }
    handleDbError(error, next);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid id. Must be a positive number.' });
    }

    const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(204).send();
  } catch (error) {
    handleDbError(error, next);
  }
});

export default router;
