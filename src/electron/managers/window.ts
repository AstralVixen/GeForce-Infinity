import { app, BrowserWindow } from "electron";
import path from "path";
import { getConfig } from "./config";
import { getIconPath } from "../utils";

const preloadPath = path.resolve(__dirname, "..", "preload.js");

export function createMainWindow(): BrowserWindow {
    const iconPath = getIconPath();

    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        title: "XForce Infinity",
        icon: iconPath || undefined,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            devTools: !app.isPackaged,
            webSecurity: true,
        },
        autoHideMenuBar: true,
    });

    const config = getConfig();
    if (
        typeof config.userAgent === "string" &&
        config.userAgent.trim() !== ""
    ) {
        mainWindow.webContents.setUserAgent(config.userAgent);
        console.log("[UserAgent] Overridden:", config.userAgent);
    } else {
        console.log("[UserAgent] Using default");
    }

    // Load saved platform URL or fallback to launcher
    const urlToLoad = (config.selectedPlatform && config.selectedPlatform.trim() !== "")
        ? config.selectedPlatform
        : 'infinity-launcher://index.html';

    mainWindow.loadURL(urlToLoad);

    return mainWindow;
}
