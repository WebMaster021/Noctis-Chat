import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { connectSocket } from "../lib/socket";
import.meta.env.VITE_BACKEND_URL

export default function ChatWindow({ conversation }: { conversation: any }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const socketRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    if (!conversation || !conversation._id) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400">
                No messages yet. Start chatting below!
            </div>
        );
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    useEffect(() => {
        const loadChat = async () => {
            try {
                const msgRes = await axios.get(
                    `${process.env.VITE_BACKEND_URL}/api/conversations/${conversation._id}/messages`,
                    { withCredentials: true }
                );
                setMessages(msgRes.data);

                const socket = connectSocket();
                socketRef.current = socket;
                socket.emit("join", conversation._id);

                socket.on("message:receive", (msg: any) => {
                    setMessages(prev => (prev.some(m => m._id === msg._id) ? prev : [...prev, msg]));
                });

                socket.on("typing", ({ userId, isTyping }: any) => {
                    const other = conversation.participants.find((p: any) => p._id === userId);
                    setTypingUser(isTyping ? other?.name || "Someone" : null);
                });
            } catch (err) {
                console.error("Failed to load chat:", err);
            }
        };

        loadChat();

        return () => {
            socketRef.current?.emit("leave", conversation._id);
            socketRef.current?.off("message:receive");
            socketRef.current?.off("typing");
        };
    }, [conversation._id]);

    const sendMessage = () => {
        if (!text.trim()) return;
        socketRef.current.emit("message:send", { conversationId: conversation._id, text });
        setText("");
    };

    const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        socketRef.current?.emit("typing", { conversationId: conversation._id, isTyping: !!e.target.value });
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4">
                {messages.map(msg => (
                    <div key={msg._id} className="flex flex-col mb-2 items-start">
                        <div className="text-xs text-gray-400 mb-1">{msg.sender?.name || "Unknown"}</div>
                        <div className="max-w-xs md:max-w-md px-3 py-2 rounded-2xl shadow bg-gray-700 text-gray-100 rounded-bl-none">
                            {msg.text}
                        </div>
                        <div className="text-[10px] text-gray-300 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                    </div>
                ))}

                {typingUser && (
                    <div className="flex items-center gap-1 text-gray-400 mt-2 ml-2">
                        <span className="text-sm italic">{typingUser} is typing</span>
                        <div className="flex gap-[2px]">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-700 flex gap-2">
        <textarea
            value={text}
            onChange={handleTyping}
            onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            }}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-800 rounded text-white resize-none h-12 leading-5"
            rows={1}
        />
                <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className={`px-4 py-2 rounded transition ${text.trim() ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 cursor-not-allowed"}`}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
