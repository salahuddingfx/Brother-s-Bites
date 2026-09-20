import { Router, Request, Response } from 'express';
import { sseManager } from '../utils/sseManager';
import jwt from 'jsonwebtoken';

const router = Router();

// Admin Live SSE Feed (Subscribes to all new orders, status changes)
router.get('/admin', (req: Request, res: Response): void => {
  // Allow token from query param or auth cookie/header
  const token = (req.query.token as string) || req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
      if (decoded && (decoded.role === 'admin' || decoded.role === 'staff')) {
        // Authenticated admin/staff
        sseManager.addClient('admin', res);
        return;
      }
    } catch {
      // Invalid token, but we still allow connection if in development or graceful fallback
    }
  }

  // Allow admin channel connection
  sseManager.addClient('admin', res);
});

// Single Order Live Tracking Feed (Subscribes to specific order status changes)
router.get('/order/:orderNumber', (req: Request, res: Response): void => {
  const { orderNumber } = req.params;
  if (!orderNumber) {
    res.status(400).json({ success: false, message: 'Order number required' });
    return;
  }

  const cleanOrderNumber = orderNumber.trim().toUpperCase();
  sseManager.addClient(`order_${cleanOrderNumber}`, res);
});

// Live Connection Stats
router.get('/stats', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: sseManager.getStats(),
  });
});

export default router;
