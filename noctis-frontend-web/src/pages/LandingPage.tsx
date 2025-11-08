import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-void text-gray-100 flex flex-col items-center justify-start pt-24 px-4 sm:px-6 md:px-8">
            {/* Hero Section */}
            <section className="text-center max-w-3xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-subheading font-extrabold mb-4 leading-tight">
                    Welcome to{" "}
                    <span className="text-red-600 font-alucard-heading">Noctis Chat</span>
                </h1>
                <p className="text-gray-400 font-hellsing-body text-base sm:text-lg md:text-xl font-text mb-8 px-2 sm:px-0">
                    A sleek real-time chat platform where conversations never sleep.
                </p>
                <Link
                    to="/login"
                    className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg font-semibold"
                >
                    Get Started
                </Link>
            </section>

            {/* About Section */}
            <section className="max-w-4xl mx-auto text-center mt-16 px-4">
                <h3 className="text-2xl sm:text-3xl font-subheading font-semibold text-red-600 mb-4">
                    About Noctis
                </h3>
                <p className="text-gray-400 font-text text-base sm:text-lg leading-relaxed">
                    Noctis is your dark companion in the night — connecting friends,
                    chats, and stories in one sleek interface. Join the realm and let your
                    messages flow under the shadow.
                </p>
            </section>

            {/* Rules Section */}
            <section className="max-w-6xl mx-auto mt-16 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
                <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-red-900/20">
                    <h4 className="text-lg sm:text-xl font-subheading font-semibold text-red-500 mb-2">
                        Respect the Night
                    </h4>
                    <p className="text-gray-400 font-text text-sm sm:text-base">
                        Keep conversations friendly and courteous. No spamming or harassment.
                    </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-red-900/20">
                    <h4 className="text-lg sm:text-xl font-subheading font-semibold text-red-500 mb-2">
                        Protect Your Secrets
                    </h4>
                    <p className="text-gray-400 font-text text-sm sm:text-base">
                        Privacy is key. Share only what you are comfortable with.
                    </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-red-900/20">
                    <h4 className="text-lg sm:text-xl font-subheading font-semibold text-red-500 mb-2">
                        Enjoy the Shadows
                    </h4>
                    <p className="text-gray-400 font-text text-sm sm:text-base">
                        Explore chats, stories, and connections in the Noctis realm.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
