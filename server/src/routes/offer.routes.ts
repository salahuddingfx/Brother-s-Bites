import { Router } from 'express';
import { getActive, getAll, getById, create, update, remove } from '../controllers/offer.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createOfferSchema, updateOfferSchema } from '../validators/offer.validator';

const router = Router();

router.get('/active', getActive);
router.get('/', authenticate, authorize('admin'), getAll);
router.get('/:id', authenticate, authorize('admin'), getById);
router.post('/', authenticate, authorize('admin'), validate(createOfferSchema), create);
router.patch('/:id', authenticate, authorize('admin'), validate(updateOfferSchema), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;
