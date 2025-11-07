import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { userId: string };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        console.log("🍪 Cookies received:", req.cookies);
        let token: string | undefined;

        if (req.cookies?.token) {
            token = req.cookies.token;
        }
        else if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { userId?: string };

        if (!decoded?.userId) {
            console.log("❌ No userId found in token:", decoded);
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
