import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

interface SignupPageProps {
    setUser: (user: any) => void;
}

function SignupPage({ setUser }: SignupPageProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [particles] = useState(() => {
        return [...Array(50)].map(() => {
            const size = Math.random() * 6 + 4;
            const top = Math.random() * 90;
            const left = Math.random() * 90;
            const duration = (Math.random() * 15 + 10) * 0.55;
            const delay = Math.random() * 10;
            const opacity = Math.random() * 0.6 + 0.4;
            const color = `rgba(255,0,0,${opacity})`;

            return { size, top, left, duration, delay, color };
        });
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/register",
                { name, email, password },
                { withCredentials: true }
            );

            setUser(res.data);
            alert("Signup successful");
            navigate("/chat");
        } catch (err: any) {
            console.log("Signup Error", err);
            alert(err.response?.data?.message || "Sign up Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] p-4">
            <div className="absolute inset-0 z-0 pointer-events-none">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            top: `${p.top}%`,
                            left: `${p.left}%`,
                            background: p.color,
                            boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}`,
                            filter: 'blur(2px)',
                            animation: `floatWisp${i} ${p.duration}s ease-in-out ${p.delay}s infinite`,
                        }}
                    />
                ))}

                <style>
                    {`
    ${[...Array(50)].map((_, i) => `
      @keyframes floatWisp${i} {
        0%   { transform: translate(0,0); opacity: 0.5; }
        25%  { transform: translate(${Math.random()*10-5}px, ${Math.random()*10-5}px); opacity: 0.7; }
        50%  { transform: translate(${Math.random()*10-5}px, ${Math.random()*10-5}px); opacity: 0.6; }
        75%  { transform: translate(${Math.random()*10-5}px, ${Math.random()*10-5}px); opacity: 0.8; }
        100% { transform: translate(0,0); opacity: 0.5; }
      }
    `).join("\n")}
  `}
                </style>
            </div>

            <div className="w-full max-w-md bg-gray-900 text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
                <h2 className="text-3xl font-bold font-subheading text-center text-red-600 mb-4">Create your account</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full font-text bg-red-600 hover:bg-red-700 hover:shadow-lg p-4 rounded-xl font-semibold transition-all"
                    >
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>
                <p className="text-center font-text text-gray-400 mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-red-500 font-text hover:underline cursor-pointer"
                    >
          Login
        </span>
                </p>

                {loading && <p className="mt-4 text-center">Authenticating...</p>}
            </div>
        </div>
    );

}

export default SignupPage;