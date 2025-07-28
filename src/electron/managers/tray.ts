import {
    Tray,
    Menu,
    app,
    BrowserWindow,
    nativeImage,
    NativeImage,
} from "electron";
import fs from "fs";
import { getIconPath } from "../utils";

export function createTray(mainWindow: BrowserWindow): Tray {
    const iconPath = getIconPath();

    let trayIcon: NativeImage | undefined;

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
