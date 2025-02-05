import { Request, Response } from 'express';
import { User } from '../models/userModel';
import bcrypt from 'bcryptjs';

interface UserController {
    registerUser: (req: Request, res: Response) => Promise<Response>;
    loginUser: (req: Request, res: Response) => Promise<Response>;
    logoutUser: (req: Request, res: Response) => Promise<Response>;
}

const userController: UserController = {
    async registerUser(req: Request, res: Response): Promise<Response> {
        const {
            name,
            email,
            password,
        }: { name: string; email: string; password: string } = req.body;
        console.log('Registering user:', { name, email });

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: 'Email is already registered' });
            }

            const user = await User.create({ name, email, password });

            //create the token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            //set the HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', //use secure in production
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 //1 hour in milliseconds
            });

            return res.status(201).json({
                message: 'User registered successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                }
            })
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ error: 'Failed to register user', details: error.message });
        }
    },

    async loginUser(req: Request, res: Response): Promise<Response> {
        const { email, password }: { email: string, password: string } = req.body;
        console.log('Logging in user:', { email });

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1hr',
            });

            //set the HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', //use secure in production
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 //1 hour in milliseconds
            });

            return res.status(200).json({ 
                message: 'Login successful',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error('Error logging in user:', error);
            return res.status(500).json({ error: 'Failed to log in', details: error.message });
        }
    };

    //add logout endpoint
    async logoutUser (_req: Request, res: Response): Promise<Response> {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    }
}

export default userController;