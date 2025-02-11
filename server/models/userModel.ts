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

    await client.query('BEGIN');

    // First, create the auth user - notice we're using auth schema
    const authUserInsertQuery = `
      INSERT INTO auth.users (
        id,  -- This needs to be a UUID
        email
      )
      VALUES (
        gen_random_uuid(),  -- Generate a UUID for the user
        $1
      )
      RETURNING id;
    `;
    // Let's add some debugging to see what's happening
    console.log('Executing user insert with email:', email);
    const authUserResult = await client.query(authUserInsertQuery, [email]);
    //const userResult = await client.query(userInsertQuery, [id, email]);
    console.log('User insert result:', authUserResult.rows[0]);

    if (!authUserResult.rows[0]?.uuid) {
      throw new Error('Failed to generate user ID');
    }

    //const userResult = await client.query(userInsertQuery, [id, email]);
    const userId = authUserResult.rows[0].id;

    const profileInsertQuery = `
      INSERT INTO public.user_account (
      username,
      email,
      password,
      first_name,
      last_name,
      user_id  -- This links to the auth.users table
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, first_name, last_name, created_at;
    `;
    const userProfileResult = await client.query(profileInsertQuery, [
      username,
      email,
      password,  // Remember to hash this before storing
      first_name,
      last_name,
      userId     // This is the UUID from auth.users
    ]);

    await client.query('COMMIT');
    
    console.log('Profile created:', userProfileResult.rows[0]);
    return userProfileResult.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  } finally {
    client.release();
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
