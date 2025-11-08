import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import http from "http";
import { Message } from "../models/messageModel";
import { Conversation } from "../models/conversationModel";
import cookie from "cookie";

export function initSocket(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie || "";
            const parsed = cookie.parse(rawCookie);
            const token = parsed.token;

            if (!token) return next(new Error("Authentication error"));
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            socket.data.userId = decoded.userId;
            next();
        } catch (err) {
            console.error("Socket auth error:", err);
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        console.log("✅ Socket connected user:", userId);

        socket.join(`user_${userId}`);

        socket.on("join", (conversationId: string) => {
            socket.join(`conversation_${conversationId}`);
        });

        socket.on("leave", (conversationId: string) => {
            socket.leave(`conversation_${conversationId}`);
        });

        socket.on("message:send", async (payload: { conversationId: string; text?: string; attachments?: any[] }) => {
            try {
                const msg = await Message.create({
                    conversation: payload.conversationId,
                    sender: userId,
                    text: payload.text,
                    attachments: payload.attachments || [],
                });

                await Conversation.findByIdAndUpdate(payload.conversationId, {
                    lastMessage: payload.text || "[attachment]",
                    lastAt: new Date(),
                });

                const populated = await msg.populate("sender", "name profilePhoto");
                io.to(`conversation_${payload.conversationId}`).emit("message:receive", populated);
            } catch (err) {
                console.error(err);
                socket.emit("message:error", { error: "Failed to send message" });
            }
        });

        socket.on("typing", ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
            socket.to(`conversation_${conversationId}`).emit("typing", { userId, isTyping });
        });

        socket.on("disconnect", () => {
            console.log("⚡ Socket disconnected", userId);
        });
    });

    return io;
}
