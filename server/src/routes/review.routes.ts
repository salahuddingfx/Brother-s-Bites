import { Router } from 'express';
import {
  getPublicReviews,
  createReview,
  verifyOrderForReview,
  getAllReviewsAdmin,
  updateReviewAdmin,
  deleteReviewAdmin,
  clearAllReviews,
} from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public: Get approved reviews, verify order, & submit review
router.get('/', getPublicReviews);
router.get('/verify-order/:query', verifyOrderForReview);
router.post('/', createReview);

// Admin: Manage, moderate, and feature reviews
router.get('/admin', authenticate, authorize('super_admin', 'admin', 'manager'), getAllReviewsAdmin);
router.delete('/admin/clear-all', authenticate, authorize('super_admin', 'admin'), clearAllReviews);
router.patch('/:id', authenticate, authorize('super_admin', 'admin', 'manager'), updateReviewAdmin);
router.delete('/:id', authenticate, authorize('super_admin', 'admin'), deleteReviewAdmin);

export default router;
