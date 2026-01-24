import { Router } from 'express';
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } from './../controllers/productControllers.js';
import { authMiddleware } from './../middlewares/authMiddleware.js';
import { adminMiddleware } from './../middlewares/adminMiddleware.js';

const router = Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById); 

router.post('/', authMiddleware, adminMiddleware, createProduct);

router.patch('/:id', authMiddleware, adminMiddleware, updateProduct);

router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;