import { Router } from 'express';
import authRoutes from './auth.routes';
import menuRoutes from './menu.routes';
import categoryRoutes from './category.routes';
import offerRoutes from './offer.routes';
import galleryRoutes from './gallery.routes';
import settingsRoutes from './settings.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import uploadRoutes from './upload.routes';
import reviewRoutes from './review.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/menu', menuRoutes);
router.use('/categories', categoryRoutes);
router.use('/offers', offerRoutes);
router.use('/gallery', galleryRoutes);
router.use('/settings', settingsRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/reviews', reviewRoutes);

export default router;
