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

export const createUser = async (user: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<UserRecord> => {
  const client = await pool.connect();
  try {
    const { username, email, password, first_name, last_name } = user;

    const userInsertQuery = `
      INSERT INTO auth.users (email)
      VALUES ($1)
      RETURNING id;
    `;

    const userResult = await client.query(userInsertQuery, [email, password]);
    const userId = userResult.rows[0].id;

    const profileInsertQuery = `
      INSERT INTO user_account (user_id, username, email, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, first_name, last_name, created_at;
    `;
    const profileResult = await client.query(profileInsertQuery, [
      userId,
      username,
      email,
      first_name,
      last_name,
    ]);
    console.log('Profile created:', profileResult.rows[0]);
    return profileResult.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// const values = [username, email, password, first_name, last_name];

// export const findUserByEmail = async (
//   email: string
// ): Promise<UserRecord | null> => {
//   const query = `
//     SELECT id, username, email, password, first_name, last_name, created_at
//     FROM auth.users
//     WHERE email = $1;
//   `;

//   try {
//     const result = await pool.query(query, [email]);
//     return result.rows[0] || null;
//   } catch (error) {
//     console.error('Error finding user by email:', error);
//     throw error;
//   }
// };
