import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app: Application = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);     // Profile actions
app.use("/api/users", userRoutes);    // Fetch all users (for chat)
app.use("/api/conversations", chatRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("🔥 Noctis Backend Running...");
});

export default app;
