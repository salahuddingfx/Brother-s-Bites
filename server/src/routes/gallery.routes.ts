import { Router } from 'express';
import multer from 'multer';
import { getAll, getAllAdmin, upload, update, remove } from '../controllers/gallery.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extname = allowed.test(file.originalname.toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

router.get('/', getAll);
router.get('/admin', authenticate, authorize('admin'), getAllAdmin);
router.post(
  '/',
  authenticate,
  authorize('admin'),
  (req: any, res: any, next: any) => {
    uploadMiddleware.single('image')(req, res, () => next());
  },
  upload
);
router.patch('/:id', authenticate, authorize('admin'), update);
router.put('/:id', authenticate, authorize('admin'), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;
