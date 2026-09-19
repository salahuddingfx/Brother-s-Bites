import { Router } from 'express';
import { get, update } from '../controllers/settings.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', get);
router.patch('/', authenticate, authorize('admin'), update);

export default router;
