import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protect all user routes for authenticated admin/super_admin
router.use(authenticate);

router.get('/', authorize('super_admin', 'admin'), getUsers);
router.get('/:id', authorize('super_admin', 'admin'), getUserById);
router.post('/', authorize('super_admin', 'admin'), createUser);
router.put('/:id', authorize('super_admin', 'admin'), updateUser);
router.delete('/:id', authorize('super_admin'), deleteUser);

export default router;
