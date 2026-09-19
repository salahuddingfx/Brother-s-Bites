import { Router } from 'express';
import { getCart, addItem, updateItemQuantity, removeItem, clearCart } from '../controllers/cart.controller';

const router = Router();

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:itemId', updateItemQuantity);
router.delete('/items/:itemId', removeItem);
router.delete('/', clearCart);

export default router;
