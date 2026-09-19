import { Router } from 'express';
import {
  getAll,
  getFeatured,
  getById,
  create,
  update,
  remove,
  toggleAvailability,
  toggleFeatured,
} from '../controllers/menu.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/menu.validator';

const router = Router();

router.get('/', getAll);
router.get('/featured', getFeatured);
router.get('/:id', getById);
router.post('/', authenticate, authorize('admin'), validate(createMenuItemSchema), create);
router.patch('/:id', authenticate, authorize('admin'), validate(updateMenuItemSchema), update);
router.delete('/:id', authenticate, authorize('admin'), remove);
router.patch('/:id/toggle-availability', authenticate, authorize('admin'), toggleAvailability);
router.patch('/:id/toggle-featured', authenticate, authorize('admin'), toggleFeatured);

export default router;
