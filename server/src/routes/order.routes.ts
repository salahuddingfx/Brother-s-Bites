import { Router } from 'express';
import {
  createOrder,
  trackOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} from '../controllers/order.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Public: create order & live order tracking
router.post('/', optionalAuth, createOrder);
router.get('/track/:orderNumber', trackOrder);
router.get('/my-orders', authenticate, getMyOrders);

// Admin only: manage orders
router.get('/stats', authenticate, authorize('admin'), getOrderStats);
router.get('/', authenticate, authorize('admin'), getAllOrders);
router.get('/:id', authenticate, authorize('admin'), getOrderById);
router.patch('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

export default router;
