import { Router } from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/upload.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|avif|svg\+xml|svg/;
    const extname = allowed.test(file.originalname.toLowerCase());
    const mimetype = allowed.test(file.mimetype) || file.mimetype.startsWith('image/');
    if (extname || mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

// Upload image to Cloudinary (Admin only)
// Supports either 'image' or 'file' field name
router.post(
  '/',
  authenticate,
  authorize('admin'),
  (req, res, next) => {
    uploadMiddleware.single('image')(req, res, (err) => {
      if (err) {
        // Fallback check if filed as 'file'
        return uploadMiddleware.single('file')(req, res, (err2) => {
          if (err2) return res.status(400).json({ success: false, message: err2.message });
          next();
        });
      }
      if (!req.file) {
        // try 'file' if req.file is empty
        return uploadMiddleware.single('file')(req, res, (err2) => {
          if (err2) return res.status(400).json({ success: false, message: err2.message });
          next();
        });
      }
      next();
    });
  },
  uploadImage
);

// Delete image from Cloudinary (Admin only)
router.delete('/', authenticate, authorize('admin'), deleteImage);

export default router;
