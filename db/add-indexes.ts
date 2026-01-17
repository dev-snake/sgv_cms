import 'dotenv/config';
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Running performance indexes migration...');
    
    const sql = readFileSync(
      join(__dirname, '../drizzle/0003_add_performance_indexes.sql'),
      'utf-8'
    );
    
    await pool.query(sql);
    
    console.log('✅ Performance indexes added successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigration();
