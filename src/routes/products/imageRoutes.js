import { Router } from 'express';
import { getAllImages, getImageById, createImage, updateImage, deleteImage } from '../../controllers/products/index.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';

const router = Router();

router.get('/', getAllImages);
router.get('/:id', getImageById);
router.post('/', authMiddleware, adminMiddleware, createImage);
router.patch('/:id', authMiddleware, adminMiddleware, updateImage);
router.delete('/:id', authMiddleware, adminMiddleware, deleteImage);

export default router;