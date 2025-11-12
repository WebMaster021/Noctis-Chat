import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getPublicUserProfile,
    deleteUser
} from "../controllers/userController";
import {User} from "../models/userModel";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

router.get("/", protect, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user?.userId } }).select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to load users" });
    }
});

router.get("/:id/public", protect, getPublicUserProfile);

router.delete("/delete", protect, deleteUser);

export default router;
