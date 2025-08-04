import { BrowserWindow, ipcMain } from "electron";
import { saveConfig } from "../managers/config";

export function registerPlatformIpcHandlers(mainWindow: BrowserWindow) {
  ipcMain.on("launch-platform", (_event, url: string) => {
    if (url && typeof url === "string") {
      mainWindow.loadURL(url);
    }
  });

  ipcMain.on("remember-platform", (_event, platform: string) => {
    try {
      saveConfig({ selectedPlatform: platform });
    } catch (err) {
      console.error("❌ Failed to save remembered platform:", err);
    }
  });
}
