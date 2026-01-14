import 'dotenv/config';
import { db } from './index';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Resetting database...');
  await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
  console.log('Database reset successfully!');
}

main().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
