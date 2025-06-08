import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { getMe, updateProfile } from "../controllers/user.controller";

const router = Router();
router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateProfile);

export default router