import { Router } from 'express';
import { submitContactMessage, getAllContactMessages } from '../controllers/contact.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public: Submit inquiry
router.post('/', submitContactMessage);

// Admin: View inquiries
router.get('/', authenticate, authorize('admin', 'super_admin'), getAllContactMessages);

export default router;
