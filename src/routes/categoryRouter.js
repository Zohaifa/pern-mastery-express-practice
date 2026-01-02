import {Router} from "express"
import { getAllCategories, createCategory } from './../controllers/categoryControllers.js';
import { authMiddleware } from './../middlewares/authMiddleware.js';
import { adminMiddleware } from './../middlewares/adminMiddleware.js';

const router = Router();

router.get('/', getAllCategories);

router.get('/:id', (req, res) => {
    return res.send(`Get category with ID: ${req.params.id}`);
});

router.post('/create', authMiddleware, adminMiddleware, createCategory);

router.patch('/:id', (req, res) => {
    return res.send(`Update category with ID: ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
    return res.send(`Delete category with ID: ${req.params.id}`);
});

export default router;