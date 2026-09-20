import { Router } from 'express';
import { trackPageView, getVisitorStats } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public: Track page view
router.post('/track', trackPageView);

// Admin: Get visitor metrics with period filter (today, yesterday, 7d, 30d, this_month, all)
router.get('/visitors', authenticate, authorize('admin', 'super_admin'), getVisitorStats);

export default router;
