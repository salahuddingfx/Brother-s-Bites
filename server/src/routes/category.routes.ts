import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, authorize('admin'), validate(createCategorySchema), create);
router.patch('/:id', authenticate, authorize('admin'), validate(updateCategorySchema), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;
