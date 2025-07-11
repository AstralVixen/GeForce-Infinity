import { app, BrowserWindow } from "electron";
import path from "path";

const GFN_WEBSITE = "https://play.geforcenow.com/";

const preloadPath = path.resolve(__dirname, "..", "preload.js");

export function createMainWindow(): BrowserWindow {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        title: "GeForce Infinity",
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            devTools: true, //!app.isPackaged,
            webSecurity: false,
        },
        autoHideMenuBar: true,
    });
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(GFN_WEBSITE);
    return mainWindow;
}
