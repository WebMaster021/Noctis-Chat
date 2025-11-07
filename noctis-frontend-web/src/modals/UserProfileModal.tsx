type Props = {
    user: { name: string; profilePhoto?: string; description?: string } | null;
    onClose: () => void;
};

const UserProfileModal = ({ user, onClose }: Props) => {
    if (!user) return null;

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed flex-col inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 text-white p-6 rounded-3xl shadow-2xl w-80 relative transform transition-transform duration-300 animate-slideUp"
                onClick={handleModalClick}
            >


                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-red-600 p-1 shadow-lg">
                    <img
                        src={user.profilePhoto || "/default-avatar.png"}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>

                <h2 className="text-2xl font-subheading font-bold text-center mt-4">{user.name}</h2>

                <p className="text-gray-400 text-center font-text mt-2 text-sm">
                    {user.description || "No bio available."}
                </p>
            </div>

            <p className="text-gray-200 font-text text-sm mt-4 select-none pointer-events-none">
                Click anywhere to close
            </p>
        </div>
    );
};

export default UserProfileModal;
