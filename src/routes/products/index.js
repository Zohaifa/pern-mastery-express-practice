import { Router } from 'express';
import productRoutes from './productRoutes.js';
import variantRoutes from './variantRoutes.js';
import imageRoutes from './imageRoutes.js';
const router = Router();

router.use('/images', imageRoutes);
router.use('/variants', variantRoutes);
router.use('/', productRoutes);

export default router;