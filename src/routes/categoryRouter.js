import {Router} from "express"
import { getAllCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from './../controllers/categoryControllers.js';
import { authMiddleware } from './../middlewares/authMiddleware.js';
import { adminMiddleware } from './../middlewares/adminMiddleware.js';

const router = Router();

router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.post('/', authMiddleware, adminMiddleware, createCategory);

router.patch('/:id', authMiddleware, adminMiddleware, updateCategory);

router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;