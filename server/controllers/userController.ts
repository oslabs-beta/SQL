import { Request, Response } from 'express';
import { createUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
import 'dotenv/config';
import { UserRecord } from '../../types/types.ts';

interface UserController {
  registerUser: (req: Request, res: Response) => Promise<Response>;
  // loginUser: (req: Request, res: Response) => Promise<Response>;
  // logoutUser: (req: Request, res: Response) => Promise<Response>;
}

const userController: UserController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const {
        username,
        email,
        password,
        first_name,
        last_name,
      }: Omit<UserRecord, 'id' | 'created_at'> = await req.body;
      console.log('Registering user:', { username, email });

      if (!username || !email || !password || !first_name || !last_name) {
        return res.status(400).json({
          error:
            'Username, email, password, first name, and last name are required',
        });
      }

      // const existingUser: UserRecord | null = await findUserByEmail(email);

      // if (existingUser) {
      //   return res.status(400).json({ error: 'Email is already registered' });
      // }

      // async function hashPassword (password) {
      //   try {
      //     const saltRounds = 10;
      //     const salt = await bcrypt.genSalt(saltRounds);
      //     const hashedPassword = await bcrypt.hash(password, salt);
      //     return hashedPassword;
      //   } catch (error) {
      //     console.error('Error hashing password:', error);
      //     throw error;
      //   }
      // }

      // const hashedPassword = await hashPassword(password);

      const user: UserRecord = await createUser({
        username,
        email,
        // password: hashedPassword,
        password,
        first_name,
        last_name,
      });

      //create the token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1h',
        }
      );

      //set the HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //use secure in production
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, //1 hour in milliseconds
      });

      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (error) {
      console.error('Error registering user:', error);
      return res
        .status(500)
        .json({ error: 'Failed to register user', details: error.message });
    }
  },

  //   async loginUser(req: Request, res: Response): Promise<Response> {
  //     const { email, password }: { email: string; password: string } = req.body;
  //     console.log('Logging in user:', { email });

  //     if (!email || !password) {
  //       return res.status(400).json({ error: 'Email and password are required' });
  //     }

  //     try {
  //       const user = await findUserByEmail(email);
  //       if (!user) {
  //         return res.status(404).json({ error: 'User not found' });
  //       }

  //       const isMatch = await bcrypt.compare(password, user.password);
  //       if (!isMatch) {
  //         return res.status(401).json({ error: 'Invalid password' });
  //       }

  //       const token = jwt.sign(
  //         { userId: user.id },
  //         process.env.JWT_SECRET as string,
  //         {
  //           expiresIn: '1h',
  //         }
  //       );

  //       //set the HTTP-only cookie
  //       res.cookie('token', token, {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV === 'production', //use secure in production
  //         sameSite: 'strict',
  //         maxAge: 1000 * 60 * 60, //1 hour in milliseconds
  //       });

  //       return res.status(200).json({
  //         message: 'Login successful',
  //         user: {
  //           id: user.id,
  //           username: user.username,
  //           email: user.email,
  //           first_name: user.first_name,
  //           last_name: user.last_name,
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error logging in user:', error);
  //       return res
  //         .status(500)
  //         .json({ error: 'Failed to log in', details: error.message });
  //     }
  //   },

  //   //add logout endpoint
  //   async logoutUser(_req: Request, res: Response): Promise<Response> {
  //     res.cookie('token', '', {
  //       httpOnly: true,
  //       expires: new Date(0),
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'strict',
  //     });
  //     return res.status(200).json({ message: 'Logged out successfully' });
  //   },
};

export default userController;
