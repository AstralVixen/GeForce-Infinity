import { useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { FaCircleUser } from "react-icons/fa6";
import { signOut } from "firebase/auth";
import { syncToCloud } from "../../utils/cloudSync";
import { auth } from "../../lib/firebase";
import { Dialog } from "../components/dialog";

export const UserMenu = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user } = useUser();
    const dropdownRef = useRef<HTMLDivElement>(null);
    useOutsideClick(dropdownRef, () => setDropdownOpen(false), dropdownOpen);
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
        <>
            {user && (
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        type="button"
                    >
                        <FaCircleUser className="text-3xl" />
                    </button>

                    {dropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute -right-4 top-full mt-2 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-60 dark:bg-gray-700 dark:divide-gray-600"
                        >
                            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                <div>
                                    <b>{user?.displayName}</b>
                                </div>
                                <div className="font-medium truncate">
                                    {user?.email}
                                </div>
                            </div>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <a
                                        onClick={
                                            syncing ? undefined : handleSync
                                        }
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        {syncing
                                            ? "Syncing..."
                                            : "Sync settings"}
                                    </a>
                                </li>
                            </ul>
                            <div className="py-2">
                                <a
                                    onClick={() => setIsDialogOpen(true)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Log out
                                </a>
                            </div>
                        </div>
                    )}
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
            )}
        </>
    );
};
