import { Router } from 'express'
import { addItemToCart, getCart, clearCart, removeItemFromCart, updateCartItem } from './../controllers/cartController.js'
import { authMiddleware } from './../middlewares/authMiddleware.js'

const router = Router()

router.get('/', authMiddleware, getCart);
router.post('/items', authMiddleware, addItemToCart);
router.patch('/items/:id', authMiddleware, updateCartItem);
router.delete('/items/:id', authMiddleware, removeItemFromCart);
router.delete('/clear', authMiddleware, clearCart);

export default router;