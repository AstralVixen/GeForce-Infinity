import { app } from "electron";
import fs from "fs";
import path from "path";
import { Config, defaultConfig } from "../../shared/types";

const configPath = path.join(app.getPath("userData"), "settings.json");

let currentConfig: Config = defaultConfig;

export function loadConfig(): void {
    try {
        if (fs.existsSync(configPath)) {
            currentConfig = JSON.parse(
                fs.readFileSync(configPath, "utf-8")
            ) as Config;
        } else {
            saveConfig();
        }
    } catch (error) {
        console.error("Error loading config:", error);
    }
}

export function saveConfig(updates: Partial<Config> = {}): void {
    try {
        currentConfig = { ...currentConfig, ...updates };
        fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));
    } catch (error) {
        console.error("Error saving config:", error);
    }
}

export function getConfig(): Config {
    return currentConfig;
}
