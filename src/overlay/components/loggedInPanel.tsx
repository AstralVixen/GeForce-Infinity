import React, { useState } from "react";
import { User, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { FaSync } from "react-icons/fa";
import { syncToCloud } from "../../utils/cloudSync";
import { Dialog } from "./dialog";

interface Props {
    user: User;
}

export const LoggedInPanel: React.FC<Props> = ({ user }) => {
    const [syncing, setSyncing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            const config = await window.electronAPI.getCurrentConfig();
            await syncToCloud(config);
            setAlertOpen(true);
        } catch (err) {
            console.error("Sync failed:", err);
            alert("Sync failed, see console.");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="text-white space-y-4 text-center">
            <h2 className="text-base font-bold">Welcome!</h2>
            <p>
                Logged in as:{" "}
                <span className="font-mono">
                    {user.displayName || user.email}
                </span>
            </p>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold ${
                        syncing
                            ? "bg-gray-500"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    <FaSync />
                    <span>{syncing ? "Syncing..." : "Sync to Cloud"}</span>
                </button>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
                >
                    Log out
                </button>
            </div>

            <Dialog
                title="Sync complete ✅"
                confirmText="OK"
                setIsOpen={setAlertOpen}
                isOpen={alertOpen}
                handleConfirm={() => {
                    setAlertOpen(false);
                }}
            ></Dialog>

            <Dialog
                title="Are you sure you want to log out?"
                confirmText="Yes"
                cancelText="No"
                setIsOpen={setIsDialogOpen}
                isOpen={isDialogOpen}
                handleConfirm={async () => {
                    setIsDialogOpen(false);
                    await handleLogout();
                }}
            ></Dialog>
        </div>
    );
};
