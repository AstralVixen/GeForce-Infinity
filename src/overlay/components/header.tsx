import { useUser } from "../contexts/UserContext";
import { UserMenu } from "./userMenu";

export const Header = () => {
    const { user } = useUser();

    return (
        <header className="w-full bg-[#0c1015] text-gray-300 p-8 font-sans">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                    <img
                        src="https://geforce-infinity.xyz/resources/geforce-infinity.png"
                        alt="Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <h2 className="text-2xl font-bold">GeForce Infinity</h2>
                </div>
                <UserMenu />
            </div>

            <p>Status: Connected to GFN 🎮</p>
            {user && (
                <p>
                    Welcome <b>{user.displayName || user.email}</b>!
                </p>
            )}
        </header>
    );
};
