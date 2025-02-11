import { RequestHandler } from 'express';
import { ServerError } from '../../types/types.ts';
import pg from 'pg';
// const { Pool } = pg;

// const pool = new Pool({
//   connectionString: process.env.SUPABASE_URI,
// });

type userDatabaseController = {
  connectUserDatabase: RequestHandler;
};
const;
