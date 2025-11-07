import { Router } from "express";
import { getCurrentUser, googleLogin, registerUser, loginUser, logoutUser } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/google", googleLogin);

router.get("/me", protect, getCurrentUser);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

export default router;
