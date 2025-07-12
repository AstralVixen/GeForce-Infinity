import {
    app,
    Notification,
    globalShortcut,
    BrowserWindow,
    shell,
    protocol,
} from "electron";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";

import { registerIpcHandlers } from "./ipc";
import { createMainWindow } from "./managers/window";
import { getConfig, saveConfig, loadConfig } from "./managers/config";
import { createTray } from "./managers/tray";
import { clientId, initRpcClient, updateActivity } from "./managers/discord";

function overrideVersionInDev() {
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
}

function registerCustomProtocols() {
    protocol.registerSchemesAsPrivileged([
        {
            scheme: "geforce-resource",
            privileges: { standard: true, secure: true },
        },
    ]);
}

function replaceColorInCSS(mainWindow: BrowserWindow, accentColor: string) {
    if (!accentColor || accentColor == "") {
        return;
    }
    mainWindow.webContents.executeJavaScript(`
    (function applyColorPatch() {
      let observer;

      function replaceColors() {
        if (observer) observer.disconnect();

        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
          style.innerHTML = style.innerHTML.replace(/#76b900/gi, '${accentColor} !important');
        });

        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
          if (!link.__patched) {
            link.removeAttribute("integrity");
            link.removeAttribute("crossorigin");

            fetch(link.href)
              .then(response => response.text())
              .then(css => {
                const patchedCSS = css.replace(/#76b900/gi, '${accentColor} !important');
                const blob = new Blob([patchedCSS], { type: 'text/css' });
                const newUrl = URL.createObjectURL(blob);
                link.href = newUrl;
                link.__patched = true;
              })
              .catch(err => {
                console.error("Failed to fetch/replace CSS for", link.href, err);
              });
          }
        });

        if (observer) {
          observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
        }
      }

      observer = new MutationObserver(() => {
        replaceColors();
      });

      replaceColors();
      observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    })();
  `);
}

async function registerAppProtocols() {
    protocol.handle("geforce-resource", async (request) => {
        const cleanPath = request.url
            .replace("geforce-resource://", "")
            .replace(/\/$/, "");
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
            return new Response(data, {
                headers: {
                    "Content-Type":
                        mimeTypes[ext] || "application/octet-stream",
                },
            });
        } catch (err) {
            console.error("Failed to load resource:", err);
            return new Response("Not Found", { status: 404 });
        }
    });

    protocol.handle("app", async (request) => {
        const url = new URL(request.url);
        const filePath = path.join(__dirname, "../overlay", url.pathname);

        try {
            const data = await fsPromises.readFile(filePath);
            return new Response(data, {
                status: 200,
                headers: { "Content-Type": "application/javascript" },
            });
        } catch (e) {
            console.error("Failed to serve file", filePath, e);
            return new Response("Not Found", { status: 404 });
        }
    });
}

function registerShortcuts(mainWindow: BrowserWindow) {
    const success = globalShortcut.register("Control+I", () => {
        mainWindow.webContents.send("sidebar-toggle");
    });

    console.log("[Shortcuts] Sidebar shortcut registered?", success);

    if (success && !getConfig().informed) {
        mainWindow.once("ready-to-show", () => {
            new Notification({
                title: "GeForce Infinity",
                body: "Press Ctrl+I to open the sidebar!",
            }).show();
        });
        saveConfig({ informed: true });
    }
}

function setupWindowEvents(mainWindow: BrowserWindow) {
    mainWindow.webContents.on("did-finish-load", () => {
        const config = getConfig();
        replaceColorInCSS(mainWindow, config.accentColor);
        mainWindow.webContents.send("config-loaded", config);
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url === "about:blank") {
            return {
                action: "allow",
                overrideBrowserWindowOptions: {
                    width: 800,
                    height: 600,
                    autoHideMenuBar: true,
                    icon: path.join(
                        __dirname,
                        "assets/resources/infinitylogo.png"
                    ),
                    title: "Account Connection",
                    webPreferences: {
                        nodeIntegration: false,
                        contextIsolation: true,
                        sandbox: true,
                        session: mainWindow.webContents.session,
                    },
                },
            };
        }
        shell.openExternal(url);
        return { action: "deny" };
    });
}

app.setName("GeForce Infinity");
app.commandLine.appendSwitch("enable-media-stream");
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-accelerated-video");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");
app.commandLine.appendSwitch("enable-native-gpu-memory-buffers");
app.commandLine.appendSwitch("enable-gpu-memory-buffer-video-frames");
app.commandLine.appendSwitch(
    "disable-features",
    "UseChromeOSDirectVideoDecoder"
);
app.commandLine.appendSwitch(
    "enable-features",
    [
        "WaylandWindowDecorations",
        "AcceleratedVideoDecodeLinuxGL",
        "VaapiVideoDecoder",
    ].join(",")
);

overrideVersionInDev();
registerCustomProtocols();

app.whenReady().then(async () => {
    await registerAppProtocols();
    loadConfig();

    const mainWindow = createMainWindow();
    createTray(mainWindow);

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

    registerShortcuts(mainWindow);
    setupWindowEvents(mainWindow);
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
    app.quit();
});
