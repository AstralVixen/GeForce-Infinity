import { contextBridge, ipcRenderer, clipboard, shell } from "electron";
import { Config } from "../shared/types";

declare global {
    interface Window {
        toggleSidebar: () => void;
    }
}

contextBridge.exposeInMainWorld("electronAPI", {
    onSidebarToggle: (callback: () => void) => {
        ipcRenderer.on("sidebar-toggle", (_event, ...args) => {
            console.log("sidebar-toggle event received in preload");
            callback();
        });
    },
    saveConfig: (config: Partial<Config>) =>
        ipcRenderer.send("save-config", config),
    onConfigLoaded: (callback: (config: Config) => void) => {
        console.log("Setting up config loaded listener");
        ipcRenderer.on("config-loaded", (event, config) => callback(config));
    },
    copyToClipboard: (text: string) => clipboard.writeText(text),
    openExternal: (url: string) => shell.openExternal(url),
    checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
    quitAndInstall: () => ipcRenderer.send("quit-and-install"),
    updateAvailable: (
        callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
    ) => ipcRenderer.on("update-available", callback),
    updateDownloaded: (
        callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
    ) => ipcRenderer.on("update-downloaded", callback),
    downloadUpdate: () => ipcRenderer.invoke("download-update"),
});
