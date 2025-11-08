import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/userModel";
import { generateToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: "Token missing" });

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID!,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            return res.status(400).json({ message: "Invalid Google token" });

        const { sub, name, email, picture } = payload;

        let user = await User.findOne({ googleId: sub });
        if (!user) {
            user = await User.create({
                googleId: sub,
                name,
                email,
                profilePhoto: picture,
            });
        } else {
            user.profilePhoto = picture ?? user.profilePhoto ?? "";
            user.name = name ?? user.name;
            await user.save();
        }

        const jwtToken = generateToken(user._id.toString());

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        res.status(200).json({
            message: "Login successful",
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
    } catch (err: any) {
        console.error("Google login error:", err);
        res.status(500).json({ message: "Authentication failed" });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        const jwtToken = generateToken(newUser._id.toString());
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePhoto: newUser.profilePhoto,
                description: newUser.description || "",
                isGoogleUser: !!newUser.googleId,
                createdAt: newUser.createdAt,
            },
        });
    } catch (err: any) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const jwtToken = generateToken(user._id.toString());

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(200).json({
            message: "Login successful",
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
    } catch (err: any) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(decoded.userId);
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
        console.error("Get current user error:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};
