import { contextBridge, ipcRenderer, clipboard, shell } from "electron";
import { Config } from "../shared/types.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare global {
    interface Window {
        toggleSidebar: () => void;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        try {
            const script = document.createElement("script");
            script.type = "module";
            script.src = "app://overlay/index.js";
            script.onerror = (error) => {
                console.log("Overlay script failed to load (may be normal):", error);
                // Don't throw error - this is expected if overlay files don't exist
            };
            script.onload = () => {
                console.log("Overlay script loaded successfully");
            };
            
            // Add additional error handling for script execution
            script.addEventListener('error', (event) => {
                console.log("Overlay script error event:", event);
            });
            
            // Wrap script append in additional try-catch
            try {
                document.body.appendChild(script);
            } catch (appendError) {
                console.log("Error appending overlay script (may be normal):", appendError);
            }
        } catch (error) {
            console.log("Error creating overlay script (may be normal):", error);
        }
    }, 100); // Small delay to ensure page is fully ready
});

const cssPath = path.join(__dirname, "../assets/tailwind.bundle.css");
let tailwindCss = "";
try {
    tailwindCss = fs.readFileSync(cssPath, "utf-8");
} catch (err) {
    console.error("❌ Failed to read Tailwind CSS:", err);
}

contextBridge.exposeInMainWorld("electronAPI", {
    getTailwindCss: () => tailwindCss,
    onSidebarToggle: (callback: () => void) => {
        ipcRenderer.on("sidebar-toggle", (_event, ...args) => {
            callback();
        });
    },
    saveConfig: (config: Partial<Config>) =>
        ipcRenderer.send("save-config", config),
    getCurrentConfig: () => ipcRenderer.invoke("get-config"),
    onConfigLoaded: (callback: (config: Config) => void) => {
        ipcRenderer.on("config-loaded", (event, config) => callback(config));
    },
    reloadGFN: () => {
        ipcRenderer.send("reload-gfn");
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
