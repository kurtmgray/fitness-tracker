import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { DB } from './types';

const dialect = new PostgresDialect({
  pool: new Pool({
    host: 'localhost',
    port: 5432,
    user: 'kurtgray',
    database: 'fitness_tracker',
  }),
});

export const db = new Kysely<DB>({
  dialect,
});