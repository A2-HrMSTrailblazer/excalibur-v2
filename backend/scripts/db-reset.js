// Drops and recreates all tables, then loads the seed data.
// Usage: npm run db:reset   (uses DATABASE_URL)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { loadEnvFile } from '../src/config.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'db');

export async function resetDatabase(connectionString) {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    await client.query(fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8'));
    await client.query(fs.readFileSync(path.join(dir, 'seed.sql'), 'utf8'));
  } finally {
    await client.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  loadEnvFile();
  const url = process.env.DATABASE_URL || 'postgres://excalibur:excalibur@localhost:5432/excalibur';
  await resetDatabase(url);
  console.log('Database reset and seeded.');
}
