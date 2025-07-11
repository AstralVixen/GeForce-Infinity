import React, { useState } from "react";
import type { Config } from "../../shared/types";

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
    { label: "Yellow", value: "#d8e413", className: "bg-[#d8e413] text-black" },
    { label: "Pink", value: "#e412e1", className: "bg-[#e412e1] text-white" },
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

    console.log("accentColor in SettingsSection:", config.accentColor);

    const getColor = () => {
        return colorOptions.find((o) => o.value === config.accentColor)
            ? config.accentColor
            : "#23272b";
    };

    console.log(getColor);

    const handleToggle = (key: keyof Config) => {
        const updatedConfig = { ...config, [key]: !config[key] };
        setConfig(updatedConfig);
        window.electronAPI.saveConfig(updatedConfig);
    };

    const handleAccentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const updated = { ...config, accentColor: e.target.value };
        setConfig(updated);
        window.electronAPI.saveConfig(updated);
    };

    /*const onToggle = (key: keyof Config, value: boolean) => {
        const update = { [key]: value };
        window.electronAPI.saveConfig(update);
        setConfig((prev) => ({ ...prev, ...update }));
    };*/

    return (
        <section className="p-4 text-gray-200 rounded-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
                <label className="flex items-center justify-between">
                    <span>Accent Color</span>
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
                    <span>Discord Rich Presence</span>
                    <input
                        type="checkbox"
                        checked={config.rpcEnabled}
                        onChange={() => handleToggle("rpcEnabled")}
                        className="toggle toggle-primary"
                    />
                </label>

                <label className="flex items-center justify-between">
                    <span>Notifications</span>
                    <input
                        type="checkbox"
                        checked={config.notify}
                        onChange={() => handleToggle("notify")}
                        className="toggle toggle-primary"
                    />
                </label>

                <label className="flex items-center justify-between">
                    <span>Autofocus</span>
                    <input
                        type="checkbox"
                        checked={config.autofocus}
                        onChange={() => handleToggle("autofocus")}
                        className="toggle toggle-primary"
                    />
                </label>
            </div>
        </section>
    );
};

export default SettingsSection;
