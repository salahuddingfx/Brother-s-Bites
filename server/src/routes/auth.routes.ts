import { Router } from 'express';
import {
  register,
  login,
  logout,
  me,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', optionalAuth, me);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
