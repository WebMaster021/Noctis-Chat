import { useState } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
    user: any;
}

export const Navbar = ({ user }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: "Home", path: "/" },
        { name: "Chats", path: "/chats" },
    ];

    const linkClasses = (isActive: boolean) =>
        `relative px-2 py-1 font-subheading ${
            isActive
                ? "text-red-500 text-[24px] font-subheading after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-red-500"
                : "text-gray-300 text-[20px] font-subheading hover:text-red-500"
        }`;

    return (
        <nav className="w-full p-4 flex justify-between items-center fixed top-0 z-50 bg-transparent">
            <h2 className="text-5xl font-logo font-extrabold text-red-600 hover:text-[#B80000] cursor-pointer">
                Noctis
            </h2>

            <div className="hidden md:flex gap-6 items-center">
                {links.map(link => (
                    <NavLink key={link.name} to={link.path} className={({ isActive }) => linkClasses(isActive)}>
                        {link.name}
                    </NavLink>
                ))}

                {user ? (
                    <NavLink to="/profile" className={({ isActive }) => linkClasses(isActive)}>
                        Profile
                    </NavLink>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => linkClasses(isActive)}>
                        Login
                    </NavLink>
                )}
            </div>

            <button
                className="md:hidden text-gray-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-[#0A0A0A] flex flex-col gap-4 p-4 md:hidden">
                    {links.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => linkClasses(isActive)}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    {user ? (
                        <NavLink
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => linkClasses(isActive)}
                        >
                            Profile
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => linkClasses(isActive)}
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            )}
        </nav>
    );
};
