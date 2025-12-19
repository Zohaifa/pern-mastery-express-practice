import { Router } from "express";
import { getUser, userSignIn, userSignUp } from "../controllers/authControllers.js";
import { authMiddleWare } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/sign-up', userSignUp);
router.post('/sign-in', userSignIn);
router.get('/me', authMiddleWare, getUser);

export default router;
