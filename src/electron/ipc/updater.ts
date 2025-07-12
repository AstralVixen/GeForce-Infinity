import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";

export function registerUpdaterHandlers({
    mainWindow,
}: {
    mainWindow: BrowserWindow;
}) {
    ipcMain.handle("check-for-updates", () => autoUpdater.checkForUpdates());
    ipcMain.on("quit-and-install", () => autoUpdater.quitAndInstall());
    ipcMain.handle("download-update", async () => {
        try {
            await autoUpdater.downloadUpdate();
        } catch (e) {
            console.error("Failed download update:", e);
        }
    });

    autoUpdater.on("update-available", () => {
        mainWindow.webContents.send("update-available");
    });
    autoUpdater.on("update-downloaded", () => {
        mainWindow.webContents.send("update-downloaded");
    });
}
