import { Router } from 'express';
import {
  createOrder,
  trackOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  getThermalReceipt,
} from '../controllers/order.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Public: create order & live order tracking
router.post('/', optionalAuth, createOrder);
router.get('/track/:orderNumber', trackOrder);
router.get('/my-orders', authenticate, getMyOrders);

// Thermal POS receipt endpoint (accessible for staff POS printer or customer verification)
router.get('/:id/thermal', getThermalReceipt);
router.get('/:id/invoice', getThermalReceipt);

// Admin only: manage orders
router.get('/stats', authenticate, authorize('admin'), getOrderStats);
router.get('/', authenticate, authorize('admin'), getAllOrders);
router.get('/:id', authenticate, authorize('admin'), getOrderById);
router.patch('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

export default router;
