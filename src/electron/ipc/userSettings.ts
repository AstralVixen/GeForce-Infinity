import { ipcMain, shell } from "electron";

interface Config {
    autofocus: boolean;
    notify: boolean;
    rpcEnabled: boolean;
    informed: boolean;
}

export function registerUserSettingsHandlers({
    saveConfig,
}: {
    saveConfig: (updates: Partial<Config>) => void;
}) {
    ipcMain.on("save-config", (event, updates: Partial<Config>) => {
        saveConfig(updates);
    });
}
