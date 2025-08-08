import { BrowserWindow, ipcMain } from "electron";

let currentPlatform: string | null = null;

export function registerStartedPlatformHandlers(mainWindow: BrowserWindow) {
	// Notify of plaftorm start
	ipcMain.on("platform-started", (_event, platformId: string) => {
		currentPlatform = platformId;
		// Broadcast to all open windows
		BrowserWindow.getAllWindows().forEach((win) => {
			win.webContents.send("platform-started", platformId);
		});
	});

	// Allow renderer to request current state
	ipcMain.handle("get-started-platform", () => currentPlatform);
}
