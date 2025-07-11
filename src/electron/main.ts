import {
    app,
    Notification,
    globalShortcut,
    BrowserWindow,
    shell,
    protocol,
} from "electron";
import { promises as fsPromises } from "fs";
import { registerIpcHandlers } from "./ipc";
import { createMainWindow } from "./managers/window";
import { getConfig, saveConfig, loadConfig } from "./managers/config";
import { createTray } from "./managers/tray";
import { clientId, initRpcClient, updateActivity } from "./managers/discord";
import path from "path";
import fs from "fs";

if (!app.isPackaged) {
    const pkgPath = path.join(__dirname, "../../package.json");
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        app.getVersion = () => pkg.version;
        console.log("[DEV] Overridden app.getVersion():", pkg.version);
    } else {
        console.warn("[DEV] Cannot find package.json to get version");
    }
}

protocol.registerSchemesAsPrivileged([
    {
        scheme: "geforce-resource",
        privileges: { standard: true, secure: true },
    },
]);

function injectOverlay(mainWindow: BrowserWindow) {
    const { pathToFileURL } = require("url");
    const overlayScriptPath = path.join(__dirname, "../overlay/index.js");
    const overlayScriptUrl = pathToFileURL(overlayScriptPath).href;

    mainWindow.webContents.executeJavaScript(`
  const s = document.createElement("script");
  s.type = "module";
  s.src = "${overlayScriptUrl}";
  document.body.appendChild(s);
`);

    /* mainWindow.webContents
        .executeJavaScript(
            `
            const s = document.createElement("script");
            s.src = "file://${overlayScriptPath}";
            document.body.appendChild(s);
        `
        )
        .catch((err) => console.error("❌ Overlay inject failed:", err));*/
}

function replaceColorInCSS(mainWindow: BrowserWindow, accentColor: string) {
    console.log("vstupujem do replaceColorInCSS");
    if (accentColor == "") {
        console.log("umrel som v replaceColorInCSS, accentColor je prazdny");
        return;
    }
    console.log("pokracujem v accentColor replace je: ", accentColor);
    const safeColor = accentColor || "#76b900";
    console.log("safeColor pre replace je: ", safeColor);

    mainWindow.webContents.executeJavaScript(`
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      style.innerHTML = style.innerHTML.replace(/#76b900/g, '${safeColor}');
    });

    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      fetch(link.href)
        .then(response => response.text())
        .then(css => {
          css = css.replace(/#76b900/g, '${safeColor}');
          const blob = new Blob([css], { type: 'text/css' });
          const newUrl = URL.createObjectURL(blob);
          link.href = newUrl;
        });
    });
  `);
}

app.setName("GeForce Infinity");
app.commandLine.appendSwitch("enable-media-stream");

app.whenReady().then(() => {
    protocol.handle("geforce-resource", async (request) => {
        const url = request.url.replace("geforce-resource://", "");
        const cleanPath = url.endsWith("/") ? url.slice(0, -1) : url;
        const filePath = path.join(__dirname, "../assets/resources", cleanPath);

        try {
            const data = await fsPromises.readFile(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".svg": "image/svg+xml",
                ".webp": "image/webp",
            };
            const mimeType = mimeTypes[ext] || "application/octet-stream";

            return new Response(data, {
                headers: {
                    "Content-Type": mimeType,
                },
            });
        } catch (err) {
            console.error("Failed to load resource:", err);
            return new Response("Not Found", { status: 404 });
        }
    });

    loadConfig();

    const mainWindow = createMainWindow();

    const tray = createTray(mainWindow);

    registerIpcHandlers({
        saveConfig,
        updateActivity,
        clientId,
        mainWindow,
    });

    if (getConfig().rpcEnabled) {
        initRpcClient(new Date(), clientId);
    }

    setInterval(() => {
        const title = mainWindow.getTitle().replace(/^.*\| /, "");
        updateActivity(title || null);
    }, 15_000);

    const shortcutRegistered = globalShortcut.register("Control+X", () => {
        console.log("shortcut pressed");
        mainWindow.webContents.send("sidebar-toggle");
    });
    console.log("Shortcut registered?", shortcutRegistered);
    if (shortcutRegistered && !getConfig().informed) {
        new Notification({
            title: "GeForce Infinity",
            body: "Press Ctrl+I to open the sidebar!",
        }).show();

        saveConfig({ informed: true });
    }

    mainWindow.webContents.on("did-finish-load", () => {
        replaceColorInCSS(mainWindow, getConfig().accentColor);
        injectOverlay(mainWindow);
        console.log("Config loaded in main process:", getConfig());
        mainWindow.webContents.send("config-loaded", getConfig());
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
    app.quit();
});
