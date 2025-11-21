import { runMigrations, getMigrationStatus } from './migrate.js';
import { closePool } from '../db.js';

const command = process.argv[2];

const main = async () => {
  try {
    if (command === 'up' || !command) {
      await runMigrations();
    } else if (command === 'status') {
      const status = await getMigrationStatus();
      console.log('\n📊 Migration Status:');
      console.log('\n✅ Executed migrations:');
      if (status.executed.length === 0) {
        console.log('   (none)');
      } else {
        status.executed.forEach((migration) => {
          console.log(`   - ${migration}`);
        });
      }
      console.log('\n⏳ Pending migrations:');
      if (status.pending.length === 0) {
        console.log('   (none)');
      } else {
        status.pending.forEach((migration) => {
          console.log(`   - ${migration}`);
        });
      }
      console.log('');
    } else {
      console.log('Usage:');
      console.log('  npm run migrate        - Run all pending migrations');
      console.log('  npm run migrate up     - Run all pending migrations');
      console.log('  npm run migrate status - Show migration status');
      process.exit(1);
    }
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
};

main();

