import { Tray, Menu, app, BrowserWindow, nativeImage } from "electron";
import path from "path";
import fs from "fs";

export function createTray(mainWindow: BrowserWindow): Tray {
    const iconPath = path.join(
        __dirname,
        "..",
        "..",
        "assets",
        "resources",
        "infinitylogo.png"
    );

    let trayIcon: Electron.NativeImage | undefined;

    if (fs.existsSync(iconPath)) {
        trayIcon = nativeImage.createFromPath(iconPath);
    } else {
        console.warn("⚠️ Tray icon not found:", iconPath);
        trayIcon = undefined; // fallback
    }

    const tray = new Tray(trayIcon ?? nativeImage.createEmpty()); // fallback
    tray.setToolTip("GeForce Infinity");

    const contextMenu = Menu.buildFromTemplate([
        { label: "Open", click: () => mainWindow.show() },
        { label: "Quit", click: () => app.quit() },
    ]);

    tray.setContextMenu(contextMenu);
    return tray;
}
