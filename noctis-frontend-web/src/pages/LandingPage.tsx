import {Link} from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-void text-gray-100 flex flex-col items-center justify-center px-6">
            <h1 className="text-4xl md:text-6xl font-subheading font-extrabold mb-4 text-center">
                Welcome to <span className="text-red-600 font-alucard-heading"> Noctis Chat</span>
            </h1>
            <p className="text-gray-400 font-hellsing-body font-text text-center mb-8 max-w-md">
                A sleek real-time chat platform where conversations never sleep.
            </p>
            <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg font-semibold">
                Get Started
            </Link>

            <section className="max-w-4xl mx-auto text-center mt-12 px-4">
                <h3 className="text-3xl font-subheading font-semibold text-red-600 mb-4">About Noctis</h3>
                <p className="text-gray-400 font-text text-lg">
                    Noctis is your dark companion in the night, connecting friends, chats, and stories in one sleek interface.
                    Join the realm and let your messages flow under the shadow.
                </p>
            </section>

            <section className="max-w-6xl mx-auto mt-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition">
                    <h4 className="text-xl font-subheading font-semibold text-red-500 mb-2">Respect the Night</h4>
                    <p className="text-gray-400 font-text">Keep conversations friendly and courteous. No spamming or harassment.</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition">
                    <h4 className="text-xl font-semibold font-subheading text-red-500 mb-2">Protect Your Secrets</h4>
                    <p className="text-gray-400 font-text">Privacy is key. Share only what you are comfortable with.</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition">
                    <h4 className="text-xl font-semibold font-subheading text-red-500 mb-2">Enjoy the Shadows</h4>
                    <p className="text-gray-400 font-text">Explore chats, stories, and connections in the Noctis realm.</p>
                </div>
            </section>

        </div>
    )
}

export default LandingPage;