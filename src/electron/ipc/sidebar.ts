import { ipcMain, BrowserWindow } from "electron";
import { getConfig } from "../managers/config";

export function registerSidebarIpcHandlers(mainWindow: BrowserWindow) {
    ipcMain.on("toggle-sidebar", () => {
        mainWindow.webContents.send("sidebar-toggle");
    });
    ipcMain.on("reload-gfn", () => {
        console.log("[MAIN] reload-GFN handler called");
        mainWindow.reload();
    });
    ipcMain.handle("get-config", () => {
        return getConfig();
    });
}
