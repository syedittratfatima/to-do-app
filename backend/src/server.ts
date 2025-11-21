import { createApp } from "./app.js";
import dotenv from "dotenv";
import { testConnection, closePool } from "./db.js";
import { runMigrations } from "./migrations/migrate.js";

dotenv.config();

const app = createApp();
const port = process.env.PORT ?? 3000;

// Test database connection before starting server
const startServer = async () => {
  console.log('Testing database connection...');
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Please check your DATABASE_URL and ensure PostgreSQL is running.');
    console.error('Server will not start without a database connection.');
    process.exit(1);
  }

  // Run migrations before starting the server
  try {
    await runMigrations();
  } catch (error) {
    console.error('❌ Failed to run migrations:', error);
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`✅ Database connection established`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    
    server.close(async () => {
      console.log('HTTP server closed');
      await closePool();
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
