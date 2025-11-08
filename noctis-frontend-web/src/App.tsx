import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { Navbar } from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import {useEffect, useState} from "react";
import axios from "axios";

function AppContent() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                    withCredentials: true,
                });
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
            navigate("/");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar user={user} />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="/signup" element={<SignupPage setUser={setUser} />} />
                    <Route path="/chats" element={<ChatPage />} />
                    <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </>
    );
}


function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
