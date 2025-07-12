import { useState } from "react";

export const ReloadButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        window.electronAPI.reloadGFN();
    };

    return (
        <div className="flex justify-center py-20 w-full">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 w-48 text-white text-lg font-semibold py-4 px-6 rounded shadow"
            >
                Reload GFN
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#0c1015] text-[#babec4] rounded-lg p-6 max-w-sm w-full shadow-xl text-center border border-gray-600">
                        <h2 className="text-lg mb-4">
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
