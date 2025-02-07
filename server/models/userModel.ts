// import { createClient } from '@supabase/supabase-js';
// import { Pool } from 'pg';
import 'dotenv/config';
import { pool } from '../db/db.ts';
// import { UserRecord } from '@types/types';
import { UserRecord } from '../types/types.ts';

// const supabaseUrl = process.env.SUPABASE_URI || '';
// const supabaseKey = process.env.SUPABASE_API_KEY || '';

// if (!supabaseUrl || !supabaseKey) {
//     throw new Error('Missing Supabase configuration');
// }

//might not need this line
// const supabase = createClient(supabaseUrl, supabaseKey)

// export const findUserByEmail = async ()

// export const pool =
// const connectionString = supabase.getDbConnectionString();

// const pool = new Pool({
//   connectionString: process.env.SUPABASE_URI,
// });

// interface UserRecord {
//   username: string,
//   email: string,
//   password: string,
//   first_name: string,
//   last_name: string
// }

// const pool = new Pool ({
//   connectionString: process.env.DATABASE_URL, // Ensure this is set in your .env file
// });

export const createUser = async (
  username: string,
  email: string,
  password: string,
  first_name: string,
  last_name: string
): Promise<UserRecord> => {
  const query = `
      INSERT INTO user_account (username, email, password, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, password, first_name, last_name, created_at;
    `;

  const values = [username, email, password, first_name, last_name];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error('User creation failed');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// async function queryDatabase() {
//   const client = await pool.connect();
//   try {
//     const result = await client.query('SELECT * FROM user_account');
//     console.log(result.rows);
//   } finally {
//     client.release();
//   }
// }

// queryDatabase();

// export const getAll;
