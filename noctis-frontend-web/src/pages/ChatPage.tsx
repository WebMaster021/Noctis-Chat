import { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
    const [activeConvo, setActiveConvo] = useState<any | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navbarHeight = 64;

    return (
        <div className="flex bg-gray-900 text-white h-screen">
            {(!isMobile || !activeConvo) && (
                <div
                    className="bg-gray-800 border-r border-gray-700 flex-shrink-0"
                    style={{
                        width: isMobile ? "100%" : 288, // 72 * 4 = 288px
                        height: `calc(100vh - ${navbarHeight}px)`,
                        marginTop: navbarHeight,
                    }}
                >
                    <ChatList onSelect={(c: any) => setActiveConvo(c)} />
                </div>
            )}

            {activeConvo && (
                <div
                    className="flex-1 flex flex-col"
                    style={{
                        height: `calc(100vh - ${navbarHeight}px)`,
                        marginTop: navbarHeight,
                    }}
                >
                    {isMobile && (
                        <div className="flex items-center p-3 border-b border-gray-700 bg-gray-800">
                            <button
                                onClick={() => setActiveConvo(null)}
                                className="mr-3 text-red-500 hover:text-red-700"
                            >
                                ← Back
                            </button>
                            <div className="font-semibold">
                                {activeConvo.participants.find((p: any) => !p.isMe)?.name || "Chat"}
                            </div>
                        </div>
                    )}
                    <ChatWindow conversation={activeConvo} />
                </div>
            )}

            {!isMobile && !activeConvo && (
                <div
                    className="flex-1 flex items-center justify-center text-gray-400"
                    style={{ marginTop: navbarHeight }}
                >
                    Select a chat
                </div>
            )}
        </div>
    );
}
