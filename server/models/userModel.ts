// import { createClient } from '@supabase/supabase-js';
// import { Pool } from 'pg';
import 'dotenv/config';
import { pool } from '../db/db.ts';
import { UserRecord } from '../../types/types.ts';

// const pool = new Pool({
//   connectionString: process.env.SUPABASE_URI,
// });

// interface UserRecord {
//   id?: number,
//   username: string,
//   email: string,
//   password: string,
//   first_name: string,
//   last_name: string
//   created_at?: Date
// }

export const createUser = async (
  user: Omit<UserRecord, 'id' | 'created_at'>
): Promise<UserRecord> => {
  const { username, email, password, first_name, last_name } = user;
  {
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
  }
};

export const findUserByEmail = async (
  email: string
): Promise<UserRecord | null> => {
  const query = `
    SELECT id, username, email, password, first_name, last_name, created_at
    FROM user_account
    WHERE email = $1;
  `;

  try {
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};
