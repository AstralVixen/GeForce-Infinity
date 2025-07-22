import React from "react";
import { User, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { FaSync } from "react-icons/fa";
import { syncToCloud } from "../../utils/SyncToCloud";

interface Props {
  user: User;
}

export const LoggedInPanel: React.FC<Props> = ({ user }) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="text-white space-y-4 text-center">
      <h2 className="text-base font-bold">Welcome!</h2>
      <p>Logged in as: <span className="font-mono">{user.displayName || user.email}</span></p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={syncToCloud}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          <FaSync />
          <span>Sync to Cloud</span>
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
