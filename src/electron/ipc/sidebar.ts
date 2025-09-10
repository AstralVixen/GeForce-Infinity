import { ipcMain, BrowserWindow } from "electron";
import { GFN_WEBSITE } from "../managers/window.js";
import { getConfig } from "../managers/config.js";

export function registerSidebarIpcHandlers(mainWindow: BrowserWindow) {
    ipcMain.on("toggle-sidebar", () => {
        mainWindow.webContents.send("sidebar-toggle");
    });
    ipcMain.on("reload-gfn", () => {
        console.log("[MAIN] reload-GFN handler called");
        mainWindow.loadURL(GFN_WEBSITE);
    });
    ipcMain.handle("get-config", () => {
        return getConfig();
    });
}
