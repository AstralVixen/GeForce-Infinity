import React, { useState } from "react";
import { User, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { FaSync } from "react-icons/fa";
import { syncToCloud } from "../../utils/SyncToCloud";

interface Props {
  user: User;
}


export const LoggedInPanel: React.FC<Props> = ({ user }) => {
  const [syncing, setSyncing] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const config = await window.electronAPI.getCurrentConfig();
      await syncToCloud(config);
      alert("Sync complete ✅");
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
        Logged in as: <span className="font-mono">{user.displayName || user.email}</span>
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold ${
            syncing ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <FaSync />
          <span>{syncing ? "Syncing..." : "Sync to Cloud"}</span>
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
        >
          Log out
        </button>
      </div>
    </div>
  );
};
