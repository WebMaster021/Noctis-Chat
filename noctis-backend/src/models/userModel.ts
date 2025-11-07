import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    profilePhoto?: string;
    googleId?: string;
    password?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        profilePhoto: { type: String, default: "" },
        description: { type: String, default: "" },
        googleId: { type: String, sparse: true },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
