import { app, BrowserWindow } from "electron";
import path from "path";
import { getConfig } from "./config";
import { getIconPath } from "../utils";

export const GFN_WEBSITE = "https://play.geforcenow.com/";

const preloadPath = path.resolve(__dirname, "..", "preload.js");

export function createMainWindow(): BrowserWindow {
    const iconPath = getIconPath();

    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        title: "GeForce Infinity",
        icon: iconPath || undefined,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            devTools: true, //!app.isPackaged,
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

    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(GFN_WEBSITE);
    return mainWindow;
}
