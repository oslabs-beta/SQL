import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.SUPABASE_URI,
  // : process.env.SUPABASE_API_KEY,
});

export { pool };
