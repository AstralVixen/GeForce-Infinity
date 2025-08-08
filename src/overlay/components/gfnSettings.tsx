import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import type { Config } from "../../shared/types";

type GFNSettingsProps = {
	config: Config;
	setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export const GFNSettings: React.FC<GFNSettingsProps> = ({
	config,
	setConfig,
}) => {
	const handleToggle = (key: keyof Config) => {
		setConfig({ ...config, [key]: !config[key] });
	};

	return (
		<>
			<h2 className="text-xl font-semibold mb-4">GFN Settings</h2>

			<label className="flex items-center justify-between">
				<span>
					Game Ready Notification
					<div className="relative group inline-block">
						<FaInfoCircle className="ml-2 cursor-pointer peer" />
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
							Enables a notification when the gaming rig
							<br />
							is ready.
						</div>
					</div>
				</span>
				<input
					type="checkbox"
					checked={config.notify}
					onChange={() => handleToggle("notify")}
					className="toggle toggle-primary"
				/>
			</label>

			<label className="flex items-center justify-between">
				<span>
					Autofocus
					<div className="relative group inline-block">
						<FaInfoCircle className="ml-2 cursor-pointer peer" />
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
							Enables autofocus on the window
							<br />
							when the gaming rig is ready
							<br />
							or when you're about to be kicked
							<br />
							due to inactivity (Inactivity Notification
							<br />
							must be enabled).
						</div>
					</div>
				</span>
				<input
					type="checkbox"
					checked={config.autofocus}
					onChange={() => handleToggle("autofocus")}
					className="toggle toggle-primary"
				/>
			</label>

			<label className="flex items-center justify-between">
				<span>
					Inactivity Notification
					<div className="relative group inline-block">
						<FaInfoCircle className="ml-2 cursor-pointer peer" />
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
							Enables a notification when you're about to be
							<br />
							kicked due to inactivity.
						</div>
					</div>
				</span>
				<input
					type="checkbox"
					checked={config.inactivityNotification}
					onChange={() => handleToggle("inactivityNotification")}
					className="toggle toggle-primary"
				/>
			</label>
		</>
	);
};
