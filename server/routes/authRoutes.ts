import express from 'express';
import { signup, login, logout, getProfile, updateProfile, getAllUsers } from '../controllers/authController.ts';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Admin routes
router.get('/users', authenticate, authorizeAdmin, getAllUsers);

export default router;
