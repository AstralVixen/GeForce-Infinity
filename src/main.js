const {
    app,
    globalShortcut,
    ipcMain,
    shell,
    clipboard,
    BrowserWindow,
    Tray,
    Menu,
    session,
    Notification,
} = require("electron");
const path = require("path");
const rpc = require("discord-rpc");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const configPath = path.join(app.getPath("userData"), "settings.cfg");

//Reading the settings
fs.readFile(configPath, "utf-8", (err, data) => {
    if (err) {
        console.error("Error reading config file:", err);
    } else {
        console.log("Config file data:", data);
    }
});
const clientId = "1270181852979789825";
let rpcClient = new rpc.Client({ transport: "ipc" });

app.setName("Geforce Infinity");

let mainWindow;
let tray;
let startTime;
let autofocus = false;
let notify = true;
let rpcEnabled = true; //Base values
let informed = false;
let notified = false;

// Listen for updates
autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update-available");
});

autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("update-downloaded");
});

function loadConfig() {
    if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath);
        const config = JSON.parse(configData);

        // Set values to config values
        autofocus = config.autofocus;
        notify = config.notify;
        rpcEnabled = config.rpcEnabled ?? true;
        informed = config.informed;

        console.log(
            `Loaded config: autofocus=${autofocus}, notify=${notify}, rpcEnabled=${rpcEnabled}`
        );
    } else {
        // If the config file doesn't exist, create it with default values
        const defaultConfig = {
            autofocus: false,
            notify: true,
            rpcEnabled: true,
            informed: false,
        };
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        console.log("Config file created with default values.");
    }
}

function saveConfig() {
    const config = {
        autofocus: autofocus,
        notify: notify,
        rpcEnabled: rpcEnabled,
        informed: informed,
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("Config saved:", config);
}

ipcMain.handle("check-for-updates", () => {
    autoUpdater.checkForUpdates();
});

ipcMain.on("quit-and-install", () => {
    autoUpdater.quitAndInstall();
});

ipcMain.handle("download-update", async () => {
    try {
        await autoUpdater.downloadUpdate();
    } catch (error) {
        console.error("Failed to download update:", error);
    }
});

ipcMain.on("open-external-link", (event, url) => {
    shell.openExternal(url);
});

ipcMain.on("set-autofocus", (event, enabled) => {
    autofocus = enabled;
    saveConfig();
    console.log(`Autofocus is now ${autofocus}`);
});

ipcMain.on("set-notify", (event, enabled) => {
    notify = enabled;
    saveConfig();
    console.log(`Notify is now ${notify}`);
});

ipcMain.handle("rpc-toggle", async (event, enable) => {
    rpcEnabled = enable;
    saveConfig();
    if (enable) {
        try {
            rpcClient = new rpc.Client({ transport: "ipc" });
            await rpcClient.login({ clientId });
            rpcClient.on("ready", () => {
                console.log("Discord Rich Presence is ready.");
                updateActivity(null); // Reinitialize the activity
            });
        } catch (error) {
            console.error("RPC Login Error:", error);
        }
    } else {
        try {
            await rpcClient.clearActivity();
            await rpcClient.destroy();
            console.log("Discord RPC off!");
        } catch (error) {
            console.error("RPC Logout Error:", error);
        }
    }
});

const sidebarHTML = `
  <div id="infinity-settings-sidebar">
    <h2>Infinity Settings</h2> 
    <hr width="300px">
    <button id="toggle-rpc" onclick="toggleRPC()">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="#7289DA" width="16" height="16">
  <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"/>
</svg>
      <span id="rpc-status">Turn RPC off</span>
    </button>
    <label style="margin-left:1rem" for="autofocus">Automatic focus?</label>
    <input type="checkbox" id="autofocus" name="autofocus"><br>
    <label style="margin-left:1rem" for="notify">Notify?</label>
    <input type="checkbox" id="notify" name="notify" checked><br>
          <section id="promos">
          <div class="social">
            <a href="https://github.com/AstralVixen/GeForce-Infinity" target="_blank" title="Follow me on GitHub">GitHub</a>
            <a href="https://geforce-infinity.xyz" target="_blank" title="Check out the website!">Website</a>
        </div>

        <div class="donate">
            <a href="https://www.patreon.com/AstralVixen" target="_blank" title="Donate via Patreon">Donate</a>
        </div>
        <div class="update">
        <button id="update-button" onclick="checkForUpdates()">Check for Updates</button>
        </div>
      </section>



  
  </div>
`;

const sidebarToggleScript = `
  const sidebar = document.getElementById('infinity-settings-sidebar');
  const rpcButton = document.getElementById('toggle-rpc');
  let rpcEnabled = true;

  function toggleSidebar() {
    if (sidebar.style.right === '0px') {
      sidebar.style.right = '-300px';
    } else {
      sidebar.style.right = '0px';
    }
  }

  async function toggleRPC() {
    rpcEnabled = !rpcEnabled;
    
    // Update the UI (text and icon) based on the new state
    document.getElementById('rpc-status').textContent = rpcEnabled ? 'Turn RPC off' : 'Turn RPC on';
    document.getElementById('toggle-rpc').className = rpcEnabled ? 'rpc-on' : 'rpc-off';
    
    try {
      // Communicate with the main process
      await window.electronAPI.rpcToggle(rpcEnabled);
      console.log('RPC toggled successfully');
    } catch (error) {
      console.error('Failed to toggle RPC:', error);
    }
  }

const AutofocusCheckbox = document.getElementById("autofocus");
AutofocusCheckbox.addEventListener("change", (event) => {
  window.electronAPI.setAutofocus(event.target.checked);
});

const NotifyCheckbox = document.getElementById("notify");
NotifyCheckbox.addEventListener("change", (event) => {
  window.electronAPI.setNotify(event.target.checked);
});

async function checkForUpdates() {
  try {
    const isUpdateAvailable = await window.electronAPI.checkForUpdates();
    console.log('Checking for updates...');

    if (isUpdateAvailable) {
      const userConsent = confirm('An update is available! Would you like to download it now?');
      if (userConsent) {
        // Call the function to start the download
        await window.electronAPI.downloadUpdate();
        alert('The update is now downloading...');
      }
    } else {
      alert('No update is available.');
    }
  } catch (error) {
    console.error('Failed to check for updates:', error);
  }
}

window.electronAPI.updateDownloaded(() => {
  const userConsent = confirm('Update downloaded. Would you like to restart and install it now?');
  if (userConsent) {
    window.electronAPI.quitAndInstall();
  }
});

`;

// Setup Discord Rich Presence
rpc.register(clientId);
rpcClient.on("ready", () => {
    console.log("Discord Rich Presence is ready.");

    const updateActivity = (gameTitle) => {
        rpcClient.setActivity({
            state: gameTitle ? `Playing ${gameTitle}` : "Idling...",
            largeImageKey: "infinity_logo",
            largeImageText: "GeForce Infinity",
            instance: false,
            startTimestamp: startTime, // Elapsed time
        });
    };

    // Initial activity update
    startTime = new Date();
    updateActivity(null);

    // Update activity every 15 seconds
    setInterval(() => {
        const title = mainWindow.getTitle();
        const gameTitle = title.startsWith("GeForce Infinity | ")
            ? title.replace("GeForce Infinity | ", "")
            : "";
        updateActivity(gameTitle);
    }, 15 * 1000);
});

function injectCustomCSS() {
    const cssPath = path.join(__dirname, "assets/infinity-styles.css");

    // Read the CSS file content
    fs.readFile(cssPath, "utf-8", (err, data) => {
        if (err) {
            console.error("Failed to load custom CSS file:", err);
            return;
        }

        // Inject the CSS into the web contents
        mainWindow.webContents.insertCSS(data);
    });
}

function replaceColorInCSS() {
    mainWindow.webContents.executeJavaScript(`
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      style.innerHTML = style.innerHTML.replace(/#76b900/g, '#285dfc !important');
    });
    
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      fetch(link.href)
        .then(response => response.text())
        .then(css => {
          css = css.replace(/#76b900/g, '#285dfc !important');
          const blob = new Blob([css], { type: 'text/css' });
          const newUrl = URL.createObjectURL(blob);
          link.href = newUrl;
        });
    });
  `);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        title: "GeForce Infinity",
        icon: path.join(__dirname, "assets/resources/infinitylogo.png"),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            webSecurity: true,
            preload: path.join(__dirname, "preload.js"),
        },
        autoHideMenuBar: true,
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL("https://play.geforcenow.com/");

    // Handle new window events by opening URLs in the default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" }; // Prevent electron from opening new instance for the url
    });

    session.defaultSession.webRequest.onBeforeRequest(
        { urls: ["wss://*/*"] },
        (details, callback) => {
            // Check if the request matches the specific Nvidia Cloudmatch endpoint
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
                    if (autofocus) {
                        mainWindow.maximize();
                    } else if (notify) {
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

    // Set the window to windowed fullscreen mode
    mainWindow.setFullScreenable(true);
    mainWindow.maximize();

    // Inject custom CSS and replace colors once the page has finished loading. TODO: Doesn't work yet
    //TODO: The clipboard doesn't work yet
    mainWindow.webContents.on("did-finish-load", () => {
        injectCustomCSS();
        replaceColorInCSS();

        mainWindow.webContents.executeJavaScript(`
      const sidebarContainer = document.createElement('div');
      sidebarContainer.innerHTML = \`${sidebarHTML}\`;
      document.body.appendChild(sidebarContainer);
      ${sidebarToggleScript}

      // Set initial checkbox states based on config
    document.getElementById("notify").checked = ${notify};
    document.getElementById("autofocus").checked = ${autofocus};
    document.getElementById("toggle-rpc").className = ${rpcEnabled} ? 'rpc-on' : 'rpc-off';
    document.getElementById("rpc-status").textContent = ${rpcEnabled} ? 'Turn RPC off' : 'Turn RPC on';


      document.addEventListener('copy', () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      window.electronAPI.copyToClipboard(selectedText);
      console.log('Copied text to local clipboard:', selectedText);
    }
  });
    `);
        console.log("Sidebar loaded");
        mainWindow.setTitle("GeForce Infinity");
    });

    // Monitor title changes and modify them
    mainWindow.on("page-title-updated", (event, title) => {
        event.preventDefault();
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
}

function createTray() {
    const trayIconPath = path.join(
        __dirname,
        "assets/resources/infinitylogo.png"
    );
    tray = new Tray(trayIconPath);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open GeForce Infinity",
            click: () => {
                mainWindow.show();
            },
        },
        {
            label: "Visit website",
            click: () => {
                shell.openExternal("https://geforce-infinity.xyz");
            },
        },
        {
            label: "Report issue",
            click: () => {
                shell.openExternal(
                    "https://github.com/AstralVixen/GeForce-Infinity/issues"
                );
            },
        },
        {
            label: "Donate",
            click: () => {
                shell.openExternal(
                    "https://www.patreon.com/c/astralvixen/membership"
                );
            },
        },
        {
            label: "Join my discord",
            click: () => {
                shell.openExternal("https://discord.gg/p5vRgQwZ9K");
            },
        },
        {
            label: "Quit",
            click: () => {
                app.quit();
            },
        },
    ]);

    tray.setToolTip("GeForce Infinity");
    tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
    loadConfig();
    createWindow();
    createTray();

    const shortcutRegistered = globalShortcut.register("Control+I", () => {
        mainWindow.webContents.executeJavaScript("toggleSidebar();");
    });

    if (shortcutRegistered) {
        console.log("Global shortcut registered successfully");

        // Once the shortcut is registered, show the notification
        if (informed === false) {
            new Notification({
                title: "GeForce Infinity",
                body: "Press Control+I to bring out the infinity settings sidebar!",
                icon: path.join(__dirname, "assets/resources/infinitylogo.png"),
            }).show();
            informed = true;
            saveConfig();
        }
    } else {
        console.error("Failed to register global shortcut");
    }

    if (rpcEnabled) {
        rpcClient.login({ clientId }).catch(console.error);
    }
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    startTime = new Date();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});
