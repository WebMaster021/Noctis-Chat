import http from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {initSocket} from "./socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log("✅ MongoDB Connected");
        server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ DB Connection Error:", err));
