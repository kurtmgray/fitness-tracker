import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { DB } from './types';

// Use DATABASE_URL if available (production/Heroku), otherwise local config
const databaseUrl = process.env.DATABASE_URL;

let poolConfig;
if (databaseUrl) {
  // Production: use connection string
  poolConfig = {
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
} else {
  // Local development: explicit config
  poolConfig = {
    host: 'localhost',
    port: 5432,
    user: 'kurtgray',
    database: 'fitness_tracker',
  };
}

const dialect = new PostgresDialect({
  pool: new Pool(poolConfig),
});

export const db = new Kysely<DB>({
  dialect,
});