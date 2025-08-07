import React from "react";
import type { Config } from "../../shared/types";
import { ReloadButton } from "./reloadButton";
import { DefaultsButton } from "./defaultsButton";
import { FaInfoCircle } from "react-icons/fa";

type SettingsSectionProps = {
    config: Config;
    setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

const colorOptions = [
    {
        label: "Default",
        value: "",
        className: "bg-transparent text-white",
    },
    { label: "Blue", value: "#0066cc", className: "bg-[#0066cc] text-white" },
    { label: "Red", value: "#cc0016", className: "bg-[#cc0016] text-white" },
    { label: "Yellow", value: "#fbf203", className: "bg-[#fbf203] text-black" },
    { label: "Pink", value: "#e412e1", className: "bg-[#e412e1] text-white" },
];

const userAgentOptions = [
    { label: "GeForce Infinity", value: "" },
    {
        label: "Chrome",
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
    },
    {
        label: "Firefox",
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0",
    },
];

export const SettingsSection: React.FC<SettingsSectionProps> = ({
    config,
    setConfig,
}) => {
    const getColorClass = (value: string) => {
        return (
            colorOptions.find((opt) => opt.value === value)?.className ||
            "text-white"
        );
    };

    console.log("config in SettingsSection:", config);

    const getColor = () => {
        return colorOptions.find((o) => o.value === config.accentColor)
            ? config.accentColor
            : "#23272b";
    };

    const getUserAgent = () => {
        return userAgentOptions.find((o) => o.value === config.userAgent)
            ? config.userAgent
            : "";
    };

    //console.log(getColor);

    const handleToggle = (key: keyof Config) => {
        const updatedConfig = { ...config, [key]: !config[key] };
        setConfig(updatedConfig);
    };

    const handleAccentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const updated = { ...config, accentColor: e.target.value };
        setConfig(updated);
    };

    const handleUserAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const updated = { ...config, userAgent: e.target.value };
        setConfig(updated);
    };

    /*const onToggle = (key: keyof Config, value: boolean) => {
        const update = { [key]: value };
        window.electronAPI.saveConfig(update);
        setConfig((prev) => ({ ...prev, ...update }));
    };*/

    return (
        <section className="p-4 text-gray-200 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
                <label className="flex items-center justify-between">
                    <span>
                        Accent Color
                        <div className="relative group inline-block">
                            <FaInfoCircle className="ml-2 cursor-pointer peer" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                Sets a custom accent color
                                <br />
                                for GeForce NOW.
                            </div>
                        </div>
                        <br />
                        <small>Reload GFN to apply changes</small>
                    </span>
                    <select
                        value={getColor()}
                        onChange={handleAccentChange}
                        className={`rounded p-2 bg-[${getColor()}] border border-gray-600 ml-4 ${getColorClass(config.accentColor)}`}
                    >
                        {colorOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className={option.className}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center justify-between">
                    <span>
                        User Agent
                        <div className="relative group inline-block">
                            <FaInfoCircle className="ml-2 cursor-pointer peer" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                Changes the User Agent — use this
                                <br />
                                if you experience issues
                                <br />
                                launching or playing games.
                            </div>
                        </div>
                        <br />
                        <small>Restart application to apply changes</small>
                    </span>
                    <select
                        value={getUserAgent()}
                        onChange={handleUserAgentChange}
                        className="rounded p-2 bg-[#23272b] border border-gray-600 ml-4 text-white"
                    >
                        {userAgentOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center justify-between">
                    <span>
                        Discord Rich Presence
                        <div className="relative group inline-block">
                            <FaInfoCircle className="ml-2 cursor-pointer peer" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                Enables Discord Rich Presence, which displays
                                <br />
                                your current game in your Discord status.
                            </div>
                        </div>
                    </span>
                    <input
                        type="checkbox"
                        checked={config.rpcEnabled}
                        onChange={() => handleToggle("rpcEnabled")}
                        className="toggle toggle-primary"
                    />
                </label>

                <label className="flex items-center justify-between">
                    <span>
                        Automute
                        <div className="relative group inline-block">
                            <FaInfoCircle className="ml-2 cursor-pointer peer" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 ml-8 mb-2 px-3 py-1 rounded-md bg-gray-500 text-white text-base opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                Automatically mutes the game
                                <br />
                                when the window is not focused.
                            </div>
                        </div>
                    </span>
                    <input
                        type="checkbox"
                        checked={config.automute}
                        onChange={() => handleToggle("automute")}
                        className="toggle toggle-primary"
                    />
                </label>
                
                {/*GFN Settings begin here*/}
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
            </div>
            {/*GFN Settings end here */}
            <div className="!flex !gap-3 !justify-evenly !mt-10 !mb-2 !text-lg !text-base !font-semibold">
                <ReloadButton />
                <DefaultsButton setConfig={setConfig} />
            </div>
        </section>
    );
};

export default SettingsSection;
