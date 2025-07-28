import { useState } from "react";

import { Dialog } from "./dialog";
import type { Config } from "../../shared/types";
import { defaultConfig } from "../../shared/types";

type DefaultsButtonProps = {
    setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export const DefaultsButton: React.FC<DefaultsButtonProps> = ({
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
                className="bg-gray-600 hover:bg-gray-700 w-48 text-white text-lg font-semibold py-2 px-4 rounded shadow"
            >
                Default Settings
            </button>

            <Dialog
                title="Load default settings?"
                confirmText="Yes"
                cancelText="No"
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                handleConfirm={handleConfirm}
            >
                <small>Restart application to apply all changes.</small>
            </Dialog>
        </div>
    );
};
