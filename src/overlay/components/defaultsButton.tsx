import { useState } from "react";

import type { Config } from "../../shared/types";
import { defaultConfig } from "../../shared/types";

type DefaultsButtonProps = {
    config: Config;
    setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export const DefaultsButton: React.FC<DefaultsButtonProps> = ({
    config,
    setConfig,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        setConfig(defaultConfig);
    };

    return (
        <div className="flex">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gray-600 hover:bg-gray-700 w-48 text-white text-lg font-semibold py-4 px-4 rounded shadow"
            >
                Defaults Settings
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#0c1015] text-[#babec4] rounded-lg p-6 max-w-sm w-full shadow-xl text-center border border-gray-600">
                        <h2 className="text-lg mb-4">
                            Load defaults settings?
                            <br />
                            <small>
                                Restart application to apply all changes.
                            </small>
                        </h2>
                        <div className="flex justify-center space-x-4 py-4">
                            <button
                                onClick={handleConfirm}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
