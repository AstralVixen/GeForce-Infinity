import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { UserMenu } from "./userMenu";

export const Header = () => {
	const { user } = useUser();
	const [startedPlatform, setStartedPlatform] = useState<string | null>(null);

	const platformDisplayMap: Record<string, string> = {
		geforce: "Connected to GeForce NOW 🎮",
		xcloud: "Connected to XCloud 🎮",
		luna: "Connected to Amazon Luna 🎮",
	};

	useEffect(() => {
		// Get initial state from main process
		window.electronAPI.getStartedPlatform().then((platform) => {
			setStartedPlatform(platform);
		});

		// Listen for real-time updates
		window.electronAPI.onPlatformStarted((platformId) => {
			setStartedPlatform(platformId);
		});
	}, []);

	const platformName = startedPlatform
		? (platformDisplayMap[startedPlatform] ?? startedPlatform)
		: "Waiting in launcher...";
	return (
		<header className="w-full bg-[#0c1015] text-gray-300 p-8 font-sans">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center space-x-4">
					<img
						src="https://geforce-infinity.xyz/resources/geforce-infinity.png"
						alt="Logo"
						className="w-8 h-8 object-contain"
					/>
					<h2 className="text-2xl font-bold">Fusio Infinity</h2>
				</div>
				<UserMenu />
			</div>

			<p>Status: {platformName}</p>
			{user && (
				<p>
					Welcome <b>{user.displayName || user.email}</b>!
				</p>
			)}
		</header>
	);
};
