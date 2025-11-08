import { useEffect, useState } from "react";
import axios from "axios";
import UserProfileModal from "../modals/UserProfileModal";

export default function ChatList({ onSelect }: { onSelect: (c: any) => void }) {
    const [convos, setConvos] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showProfile, setShowProfile] = useState(false);

    const viewProfile = async (user: any) => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${user._id}/public`,
                { withCredentials: true }
            );
            setSelectedUser(data);
            setShowProfile(true);
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const meRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true });
                setUserId(meRes.data.id);

                const convosRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/conversations`, { withCredentials: true });
                setConvos(convosRes.data);

                const usersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, { withCredentials: true });
                setUsers(usersRes.data);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        load();
    }, []);

    const filteredUsers = users.filter(u => u._id !== userId && u.name.toLowerCase().includes(search.toLowerCase()));

    const startConversation = async (user: any) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/conversations`,
                { otherUserID: user._id },
                { withCredentials: true }
            );
            const convosRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/conversations`, { withCredentials: true });
            setConvos(convosRes.data);
            onSelect(res.data);
        } catch (err) {
            console.error("Failed to start conversation:", err);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-y-auto">
            <div className="p-3 border-b border-gray-700">
                <h2 className="font-semibold mb-2">Chats</h2>
                {convos.length === 0 ? (
                    <div className="text-center text-gray-400 mt-4">
                        No conversations yet 👋<br />Start chatting with someone!
                    </div>
                ) : (
                    convos.map(c => {
                        const others = c.participants.filter((p: any) => p._id !== userId);
                        const other = others[0];
                        const name = other?.name || "Unknown";
                        const avatar = other?.profilePhoto || "/default-avatar.png";

                        return (
                            <div
                                key={c._id}
                                className="p-2 hover:bg-gray-700 rounded flex items-center justify-between cursor-pointer"
                                onClick={() => onSelect(c)}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover border border-gray-600" />
                                    <div>
                                        <div className="font-medium">{name}</div>
                                        <div className="text-sm text-gray-400 truncate">{c.lastMessage || "..."}</div>
                                    </div>
                                </div>
                                <button
                                    className="text-red-500 hover:text-red-700 ml-2"
                                    onClick={async e => {
                                        e.stopPropagation();
                                        if (window.confirm("Are you sure you want to delete this conversation?")) {
                                            try {
                                                await axios.delete(`http://localhost:5000/api/conversations/${c._id}`, { withCredentials: true });
                                                setConvos(prev => prev.filter(conv => conv._id !== c._id));
                                            } catch (err) {
                                                console.error("Failed to delete conversation:", err);
                                            }
                                        }
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-3 flex-1 overflow-y-auto mt-2">
                <h2 className="font-semibold mb-2">All Users</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full p-1 mb-2 rounded bg-gray-700 text-sm focus:outline-none"
                />
                {filteredUsers.map(u => (
                    <div key={u._id} className="p-2 hover:bg-gray-700 rounded flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={u.profilePhoto || "/default-avatar.png"} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-medium">{u.name}</span>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => startConversation(u)} className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded">
                                Message
                            </button>
                            <button onClick={() => viewProfile(u)} className="text-xs bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded">
                                View
                            </button>
                        </div>
                    </div>
                ))}

                {showProfile && <UserProfileModal user={selectedUser} onClose={() => setShowProfile(false)} />}
            </div>
        </div>
    );
}
