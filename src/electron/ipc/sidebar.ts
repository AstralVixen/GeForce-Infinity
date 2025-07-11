import { ipcMain, BrowserWindow } from "electron";

export function registerSidebarIpcHandlers(mainWindow: BrowserWindow) {
    ipcMain.on("toggle-sidebar", () => {
        mainWindow.webContents.send("sidebar-toggle");
    });
}
