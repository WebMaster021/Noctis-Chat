import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    conversation: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    text?: string;
    attachments?: { url: string; type?: string }[];
    createdAt: Date;
    deliveredTo?: mongoose.Types.ObjectId[];
    readBy?: mongoose.Types.ObjectId[];
}

const messageSchema = new Schema<IMessage>({
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    attachments: [{ url: String, type: String }],
    deliveredTo: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    readBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
}, { timestamps: true });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
