import { Router } from 'express'
import { addItemToCart, getCart, clearCart, removeItemFromCart, updateCartItem } from './../controllers/cartController.js'

const router = Router()

router.get('/', getCart);
router.post('/items', addItemToCart);
router.patch('/', updateCartItem);
router.delete('/items/:id', removeItemFromCart);
router.delete('items', clearCart)

export default router;