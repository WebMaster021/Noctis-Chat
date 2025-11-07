import { Router } from "express";
import { protect, AuthRequest } from "../middlewares/authMiddleware";
import { Conversation } from "../models/conversationModel";
import { Message } from "../models/messageModel";

const router = Router();

router.get("/", protect, async (req: AuthRequest, res) => {
    const userId = req.user!.userId;
    const convos = await Conversation.find({ participants: userId })
        .sort({ lastMessageAt: -1 })
        .populate("participants", "name email profilePhoto");
    res.json(convos);
});

router.post("/", protect, async (req: AuthRequest, res) => {
    const userId = req.user!.userId;
    const { otherUserID } = req.body;

    if (!otherUserID) return res.status(400).send("otherUserId required");

    try {
        let convo = await Conversation.findOne({
            participants: { $all: [userId, otherUserID], $size: 2 },
        }).populate("participants", "name email profilePhoto");

        if (!convo) {
            convo = await Conversation.create({ participants: [userId, otherUserID] });
            convo = await convo.populate("participants", "name email profilePhoto");
        }

        res.status(200).json(convo);
    } catch (err) {
        console.error("Error creating conversation:", err);
        res.status(500).json({ message: "Failed to create conversation" });
    }
});


router.get("/:id/messages", protect, async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { limit = 30, before } = req.query;
    const query: any = { conversation: id };
    if (before) query.createdAt = { $lt: new Date(before as string) };

    const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .populate("sender", "name profilePhoto");

    res.json(messages.reverse());
});

router.delete("/:id", protect, async (req: AuthRequest, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    try {
        const convo = await Conversation.findById(id);
        if (!convo) return res.status(404).json({ message: "Conversation not found" });

        if (!convo.participants.includes(userId as any)) {
            return res.status(403).json({ message: "Not authorized to delete this conversation" });
        }

        await Message.deleteMany({ conversation: id });

        await convo.deleteOne();

        res.status(200).json({ message: "Conversation deleted" });
    } catch (err) {
        console.error("Delete conversation error:", err);
        res.status(500).json({ message: "Failed to delete conversation" });
    }
});


export default router;
