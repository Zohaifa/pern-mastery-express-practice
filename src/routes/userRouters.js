import {Router} from 'express';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userControllers.js';

const router = Router();

router.get('/get', getAllUsers);
router.get('/get/:id', getUserById);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;