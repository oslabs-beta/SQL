import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

//this endpoint might be '/signup'
router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser);

export default router;
