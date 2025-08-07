import { useState } from "react";
import { Dialog } from "./dialog";

export const ReloadButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        window.electronAPI.reloadGFN();
    };

    return (
        <div className="flex">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 w-40 text-white text-lg font-semibold py-2 px-4 rounded shadow"
            >
                Reload Platform
            </button>

            <Dialog
                title="This action will kick you out of the running game."
                confirmText="OK"
                cancelText="Cancel"
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                handleConfirm={handleConfirm}
            ></Dialog>
        </div>
    );
};
