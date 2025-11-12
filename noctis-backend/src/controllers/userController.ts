import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto,
            description: user.description || "",
            isGoogleUser: !!user.googleId,
            createdAt: user.createdAt,
        });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ message: "Failed to fetch user profile" });
    }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, profilePhoto, description } = req.body;

        const user = await User.findById(req.user?.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name !== undefined) user.name = name;
        if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
        if (description !== undefined) user.description = description; // ✅ always allow updating

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto,
                description: user.description || "",
                isGoogleUser: !!user.googleId,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
};


export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user?.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.googleId) {
            return res.status(400).json({
                message: "Password change is not available for Google login users",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password || "");
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ message: "Failed to change password" });
    }
};

export const getPublicUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select("name profilePhoto description");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteUser = async (req: any, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        await User.findByIdAndDelete(userId);
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({ message: "Failed to delete account" });
    }
};
