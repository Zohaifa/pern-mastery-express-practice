import { Router } from "express";
import { getUser, userSignIn, userSignUp } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/sign-up', userSignUp);
router.post('/sign-in', userSignIn);
router.get('/me', authMiddleware, getUser);

export default router;
