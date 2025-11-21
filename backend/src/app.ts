import express from 'express';
import { ZodError } from 'zod';
import todosRouter from './routes/todos.js';
import { testConnection } from './db.js';

export const createApp = () => {
  const app = express();

  // CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  // Health check endpoint with database connection test
  app.get('/health', async (_req, res) => {
    const dbConnected = await testConnection();
    res.status(dbConnected ? 200 : 503).json({
      status: dbConnected ? 'ok' : 'error',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/todos', todosRouter);

  // Error handling middleware
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error handler:', err);

    if (err instanceof Error) {
      // Handle Zod validation errors
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json({
          message: 'Validation error',
          errors: err.errors,
          details: messages,
        });
      }

      // Handle database connection errors
      if (err.message.includes('Database connection') || 
          err.message.includes('Database authentication') ||
          err.message.includes('Database not found') ||
          err.message.includes('Table not found')) {
        return res.status(503).json({
          message: err.message,
          type: 'database_error',
        });
      }

      // Handle other known errors
      if (err.message.includes('already exists')) {
        return res.status(409).json({
          message: err.message,
          type: 'conflict',
        });
      }

      // Generic error response
      return res.status(500).json({
        message: err.message || 'Internal server error',
        type: 'server_error',
      });
    }

    // Unknown error
    res.status(500).json({
      message: 'An unexpected error occurred',
      type: 'unknown_error',
    });
  });

  return app;
};
