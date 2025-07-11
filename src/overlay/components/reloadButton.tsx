import { useState } from "react";

export const ReloadButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        // Tu sa vykoná tvoj skript
        console.log("✅ User confirmed action");
        // napr. spusti nejakú funkciu:
        // performDangerousAction();
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 w-80 text-white font-semibold py-2 px-4 rounded shadow"
            >
                Reload GFN
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl text-center">
                        <h2 className="text-lg font-semibold mb-4">
                            This action will kick you out of the running game.
                        </h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleConfirm}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                OK
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
