import { Router } from 'express'
import { createVariant, deleteVariant, getAllVariant, getVariantById, updateVariant } from './../../controllers/products/index.js'
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';

const router = Router();

router.get('/', getAllVariant);
router.get('/:id', getVariantById);
router.post('/', authMiddleware, adminMiddleware, createVariant);
router.patch('/:id', authMiddleware, adminMiddleware, updateVariant);
router.delete('/:id', authMiddleware, adminMiddleware, deleteVariant);


export default router