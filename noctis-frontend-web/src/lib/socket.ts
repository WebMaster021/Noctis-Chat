import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket() {
    if (socket) return socket;
    socket = io("http://localhost:5000", {
        withCredentials: true,
        autoConnect: true,
    });
    return socket;
}

export function disconnectSocket() {
    socket?.disconnect();
    socket = null;
}
