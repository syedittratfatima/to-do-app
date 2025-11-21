import { pool } from '../db.js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createMigrationsTable = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const getExecutedMigrations = async (): Promise<string[]> => {
  const result = await pool.query('SELECT name FROM migrations ORDER BY name ASC');
  return result.rows.map((row: { name: string }) => row.name);
};

const markMigrationExecuted = async (name: string): Promise<void> => {
  await pool.query('INSERT INTO migrations (name) VALUES ($1)', [name]);
};

const getMigrationFiles = (): string[] => {
  const migrationsDir = join(__dirname, '..', '..', 'sql');
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();
  return files;
};

const runMigration = async (filename: string): Promise<void> => {
  const migrationsDir = join(__dirname, '..', '..', 'sql');
  const filePath = join(migrationsDir, filename);
  const sql = readFileSync(filePath, 'utf-8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await markMigrationExecuted(filename);
    await client.query('COMMIT');
    console.log(`✅ Migration ${filename} executed successfully`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const runMigrations = async (): Promise<void> => {
  try {
    console.log('🔄 Starting database migrations...');
    
    await createMigrationsTable();
    console.log('✅ Migrations table ready');

    const executedMigrations = await getExecutedMigrations();
    const allMigrations = getMigrationFiles();
    const pendingMigrations = allMigrations.filter(
      (migration) => !executedMigrations.includes(migration)
    );

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations. Database is up to date.');
      return;
    }

    console.log(`📋 Found ${pendingMigrations.length} pending migration(s)`);

    for (const migration of pendingMigrations) {
      console.log(`🔄 Running migration: ${migration}`);
      await runMigration(migration);
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

export const getMigrationStatus = async (): Promise<{
  executed: string[];
  pending: string[];
}> => {
  await createMigrationsTable();
  const executedMigrations = await getExecutedMigrations();
  const allMigrations = getMigrationFiles();
  const pendingMigrations = allMigrations.filter(
    (migration) => !executedMigrations.includes(migration)
  );

  return {
    executed: executedMigrations,
    pending: pendingMigrations,
  };
};

