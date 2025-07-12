export const Header = () => {
    return (
        <header className="w-full bg-[#0c1015] text-gray-300 p-8 font-sans">
            <div className="flex items-center space-x-4 mb-2">
                <img
                    src="geforce-resource://infinitylogo.png"
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                />
                <h2 className="text-2xl font-bold">GeForce Infinity</h2>
            </div>

            <p>Status: Connected to GFN 🎮</p>
        </header>
    );
};
