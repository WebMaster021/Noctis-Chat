import {useState, useEffect, useRef} from "react";
import { toast } from "react-hot-toast";
import { Loader2, Pencil } from "lucide-react";
import axios from "axios";

const ProfilePage = ({ onLogout }: { onLogout: () => void }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {

                setName(user.name);
                setPassword("");
                setDescription(user.description || "");
                setPhoto(user.profilePhoto || "");
                setIsEditingName(false);
                setIsEditingPassword(false);
                toast("Changes canceled");
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [user]);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                    withCredentials: true,
                });
                setUser(res.data);
                setName(res.data.name || "");
                setDescription(res.data.description || "");
                setPhoto(res.data.profilePhoto || "");
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p>Loading profile...</p>
            </div>
        );
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoLoading(true);
        try {
            await new Promise((res) => setTimeout(res, 2000));
            setPhoto(URL.createObjectURL(file));
            toast.success("Profile photo uploaded!");
        } catch {
            toast.error("Failed to upload photo.");
        } finally {
            setPhotoLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload: any = { name, description };
            if (!user.isGoogleUser || (user.isGoogleUser && photo !== user.profilePhoto)) {
                payload.profilePhoto = photo;
            }

            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
                payload,
                { withCredentials: true }
            );

            setUser(res.data.user);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Profile update error:", err);
            toast.error("Failed to update profile.");
        } finally {
            setSaving(false);
            setIsEditingName(false);
            setIsEditingPassword(false);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] flex flex-col items-center p-6">

            <div ref={formRef} className="bg-gray-800 rounded-3xl shadow-2xl p-8 mt-30 w-full max-w-md flex flex-col items-center relative">

                <div className="relative">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-red-500 to-pink-600 shadow-[0_0_20px_rgba(255,0,0,0.6)] animate-pulse">
                        <img
                            src={photo || "/default-avatar.png"}
                            alt={name}
                            className="w-full h-full object-cover rounded-full border-2 border-gray-900"
                        />
                    </div>
                    {photoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <Loader2 className="animate-spin text-white w-6 h-6" />
                        </div>
                    )}
                    <label className="block font-text mt-2 text-sm text-gray-400 cursor-pointer hover:underline text-center">
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        Upload Photo
                    </label>
                </div>

                <div className="flex items-center gap-2 mt-4 mb-3">
                    {isEditingName ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-700 p-2 rounded-md outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        />
                    ) : (
                        <h2 className="text-2xl font-subheading font-bold text-red-500">{name}</h2>
                    )}
                    <Pencil
                        className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500 transition"
                        onClick={() => setIsEditingName(!isEditingName)}
                    />
                </div>

                <p className="text-gray-400 font-text mb-3 text-center">{user.email}</p>

                <div className="flex items-center gap-2 mb-4">
                    {user.isGoogleUser ? (
                        <p className="text-sm text-gray-500">No password required for Google users</p>
                    ) : isEditingPassword ? (
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                            className="bg-gray-700 p-2 rounded-md outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        />
                    ) : (
                        <p className="text-gray-400">••••••</p>
                    )}

                    {!user.isGoogleUser && (
                        <Pencil
                            className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500 transition"
                            onClick={() => setIsEditingPassword(!isEditingPassword)}
                        />
                    )}
                </div>

                <textarea
                    placeholder="Add a short description..."
                    className="bg-gray-700 w-full p-3 rounded-xl font-text outline-none text-sm resize-none mb-4 focus:ring-2 focus:ring-red-500 transition-all"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <p className="text-gray-500 font-text text-sm mb-6">Joined on {new Date(user.createdAt).toLocaleDateString()}</p>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-red-600 text-gray-300 font-text hover:bg-red-700 p-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-xl"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex-1 font-text text-gray-300 bg-gray-700 hover:bg-gray-600 p-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-xl"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ProfilePage;
