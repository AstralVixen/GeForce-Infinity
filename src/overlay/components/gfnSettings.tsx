import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import type { Config } from "../../shared/types";

type GFNSettingsProps = {
	config: Config;
	setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

const resolutionOptions = [
    { label: "1366 x 768", value: "1366x768" },
    { label: "1920 x 1080", value: "1920x1080" },
    { label: "2560 x 1440", value: "2560x1440" },
];

const fpsOptions = [
    { label: "30 FPS", value: 30 },
    { label: "60 FPS", value: 60 },
    { label: "120 FPS - Ultimate Only", value: 120 }
];

export const GFNSettings: React.FC<GFNSettingsProps> = ({
	config,
	setConfig,
}) => {
	const handleToggle = (key: keyof Config) => {
		setConfig({ ...config, [key]: !config[key] });
	};

	const getResolutionValue = () => {
        const current = `${config.monitorWidth}x${config.monitorHeight}`;
        return resolutionOptions.some((r) => r.value === current)
            ? current
            : resolutionOptions[0].value;
    };

    const getFpsValue = () => {
        return fpsOptions.some((f) => f.value === config.framesPerSecond)
            ? config.framesPerSecond
            : fpsOptions[0].value;
    };

	const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			const [wStr, hStr] = e.target.value.split("x");
			const w = Number(wStr);
			const h = Number(hStr);
	
			if (!Number.isNaN(w) && !Number.isNaN(h)) {
				const nextConfig: Config = {
					...config,
					monitorWidth: w,
					monitorHeight: h,
				};
				setConfig(nextConfig);
			}
		};
	
		const handleFpsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			const fps = Number(e.target.value);
			if (!Number.isNaN(fps)) {
				setConfig({ ...config, framesPerSecond: fps });
			}
		};

	return (
		<>
			<h2 className="text-xl font-semibold mb-4">GFN Settings</h2>
			
			<label className="flex items-center justify-between">
								<span>
									Resolution
									<div className="relative group inline-block">
										<FaInfoCircle className="ml-2 cursor-pointer peer" />
										<div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
											Select the target monitor resolution
											<br />
											used for streaming.
										</div>
									</div>
								</span>
								<select
									value={getResolutionValue()}
									onChange={handleResolutionChange}
									className="rounded p-2 bg-[#23272b] border border-gray-600 ml-4 text-white"
								>
									{resolutionOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</label>
							<label className="flex items-center justify-between">
								<span>
									FPS
									<div className="relative group inline-block">
										<FaInfoCircle className="ml-2 cursor-pointer peer" />
										<div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
											Select the target frame rate.
										</div>
									</div>
								</span>
								<select
									value={getFpsValue()}
									onChange={handleFpsChange}
									className="rounded p-2 bg-[#23272b] border border-gray-600 ml-4 text-white"
								>
									{fpsOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</label>
							
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
