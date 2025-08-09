import {
    app,
    Notification,
    globalShortcut,
    BrowserWindow,
    shell,
    protocol,
    session,
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

//TODO: in future we could greate "theme" CSS files, which will be overriding default nvidia styles,
// so it would be less buggy, more stable, easier to maintain, debug and customizable, instead of
// dynamically replacing it and running obbserver on top of DOM
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
    /*const success = globalShortcut.register("Control+I", () => {
        mainWindow.webContents.send("sidebar-toggle");
    });

    console.log("[Shortcuts] Sidebar shortcut registered?", success);*/

    if (!getConfig().informed) {
        mainWindow.once("ready-to-show", () => {
            new Notification({
                title: "GeForce Infinity",
                body: "Press Ctrl+I to open the sidebar!",
                icon: path.join(
                    __dirname,
                    "..",
                    "..",
                    "assets",
                    "resources",
                    "infinitylogo.png"
                ),
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

    mainWindow.on("blur", () => {
        if (getConfig().automute === true) {
            mainWindow.webContents.setAudioMuted(true);
        }
    });

    mainWindow.on("focus", () => {
        if (getConfig().automute === true) {
            mainWindow.webContents.setAudioMuted(false);
        }
    });

    mainWindow.on("page-title-updated", (event, title) => {
        event.preventDefault();

        if (title === "Game ending in 60s") {
            const config = getConfig();
            if (config.inactivityNotification === true) {
                new Notification({
                    title: "GeForce Infinity",
                    body: "Your game is about to end in 60 seconds!",
                    icon: path.join(
                        __dirname,
                        "assets/resources/infinitylogo.png"
                    ),
                }).show();
            }
            if (
                config.inactivityNotification === true &&
                config.autofocus === true
            ) {
                mainWindow.maximize();
            }
        }
        let gameName = title
            .replace(/^GeForce NOW - /, "")
            .replace(/ on GeForce NOW$/, "");
        if (
            title === "GeForce Infinity | GeForce NOW" ||
            title === "GeForce NOW"
        ) {
            mainWindow.setTitle("GeForce Infinity");
        } else {
            const modifiedTitle = `GeForce Infinity${
                gameName ? " | " + gameName : ""
            }`;
            mainWindow.setTitle(modifiedTitle);
        }
    });

    let notified = false;
    session.defaultSession.webRequest.onBeforeRequest(
        { urls: ["wss://*/*"] },
        (details, callback) => {
            // Check if the request matches the specific Nvidia Cloudmatch endpoint
            const config = getConfig();
            const url = details.url;
            const isNvidiaRequest =
                url.includes("nvidiagrid.net") &&
                url.includes("/sign_in") &&
                url.includes("peer_id");

            if (isNvidiaRequest) {
                console.log(
                    "Detected Nvidia Cloudmatch WebSocket upgrade request:"
                );
                if (!notified) {
                    if (config.autofocus) {
                        mainWindow.maximize();
                    } else if (config.notify) {
                        new Notification({
                            title: "GeForce Infinity",
                            body: "Your gaming rig is ready!",
                            icon: path.join(
                                __dirname,
                                "assets/resources/infinitylogo.png"
                            ),
                        }).show();
                    }
                    notified = true;

                    // Reset notification flag
                    setTimeout(() => {
                        notified = false;
                    }, 10000);
                }
            }
            callback({ cancel: false });
        }
    );

    session.defaultSession.webRequest.onBeforeSendHeaders(
        { urls: ["*://*.nvidiagrid.net/v2/*"] },
        (details, callback) => {
            const headers = details.requestHeaders;

            // Force nv-device-os and related platform headers
            headers["nv-device-os"] = "WINDOWS";
            headers["sec-ch-ua-platform"] = '"WINDOWS"';
            headers["sec-ch-ua-platform-version"] = "14.0.0";

           /* // Normalize and update the User-Agent if present
            const uaKey =
                "User-Agent" in headers
                    ? "User-Agent"
                    : "user-agent" in headers
                        ? "user-agent"
                        : null;

            if (uaKey && typeof headers[uaKey] === "string") {
                const ua = headers[uaKey] as string;
                // (Mozilla/x.x) (...) -> Mozilla/x.x (Windows NT 10.0; Win64; x64)
                const patched = ua.replace(
                    /(Mozilla\/[\d.]+) \(.+?\)/,
                    "$1 (Windows NT 10.0; Win64; x64)"
                );
                headers[uaKey] = patched;
            }*/

            callback({ requestHeaders: headers });
        }
    );

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

async function patchFetchForSessionRequest(mainWindow: Electron.CrossProcessExports.BrowserWindow) {
    await mainWindow.webContents.executeJavaScript(`(() => {
      const originalFetch = window.fetch.bind(window);
    
      function isTarget(urlString) {
        try {
          const u = new URL(urlString, location.origin);
          return /\\.nvidiagrid\\.net$/i.test(u.hostname) && /\\/v2\\/session/i.test(u.pathname);
        } catch {
          return false;
        }
      }
    
      async function tryPatchBody(initBody) {
        if (!initBody) return undefined;
    
        const readText = () => {
          if (typeof initBody === "string") return initBody;
          if (initBody instanceof ArrayBuffer || ArrayBuffer.isView(initBody)) {
            return new TextDecoder().decode(initBody);
          }
          // Other body types (Blob, FormData, URLSearchParams) are skipped here for brevity
          return null;
        };
    
        const text = readText();
        if (!text) return undefined;
    
        const trimmed = text.trim();
        if (!trimmed || (trimmed[0] !== "{" && trimmed[0] !== "[")) return undefined;
    
        let parsed;
        try { parsed = JSON.parse(trimmed); } catch { return undefined; }
    
        const srd = parsed && parsed.sessionRequestData;
        if (!srd || srd.clientRequestMonitorSettings == null) return undefined;
        
        const clientSettings = await electronAPI.getCurrentConfig();
        
        srd.clientRequestMonitorSettings = [
          { 
            widthInPixels: clientSettings.monitorWidth,  
            heightInPixels: clientSettings.monitorHeight,
            framesPerSecond: clientSettings.framesPerSecond, 
            displayData: null, 
            dpi: 0, 
            hdr10PlusGamingData: null, 
            monitorId: 0, 
            positionX: 0, 
            positionY: 0, 
            sdrHdrMode: 0
          }
        ];
    
        return JSON.stringify(parsed);
      }
    
      const wrappedFetch = Object.assign(async function fetch(input, init) {
        const url = (typeof input === "string" || input instanceof URL) ? String(input) : input.url;
        if (!isTarget(url)) {
          return originalFetch(input, init);
        }
    
        if (init && init.body != null) {
          const patched = await tryPatchBody(init.body);
          if (patched !== undefined) {
            const newInit = {
              ...init,
              body: patched
            };
            return originalFetch(input, newInit);
          }
        }
    
        return originalFetch(input, init);
      }, originalFetch);
    
      window.fetch = wrappedFetch;
    })();`);
}

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
        const title = mainWindow.getTitle();
        const gameTitle = title.startsWith("GeForce Infinity | ")
            ? title.replace("GeForce Infinity | ", "")
            : "";
        updateActivity(gameTitle || null);
    }, 15_000);

    registerShortcuts(mainWindow);

    await patchFetchForSessionRequest(mainWindow);

    setupWindowEvents(mainWindow);
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
    app.quit();
});
