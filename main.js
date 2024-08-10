const { app, globalShortcut, ipcMain, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const rpc = require('discord-rpc');

const clientId = '1270181852979789825'; // Replace with your Discord application client ID
let rpcClient = new rpc.Client({ transport: 'ipc' });

let mainWindow;
let tray;
let startTime; // To track the time when the app was started

ipcMain.handle('rpc-toggle', async (event, enable) => {
  if (enable) {
    try {
      rpcClient = new rpc.Client({ transport: 'ipc' });
      await rpcClient.login({ clientId });

        rpcClient.on('ready', () => {
          console.log('Discord Rich Presence is ready.');
          updateActivity(null); // Make sure to reinitialize the activity
        });
    } catch (error) {
      console.error('RPC Login Error:', error);
    }
  } else {
    try {
      await rpcClient.clearActivity();
      await rpcClient.destroy();
    } catch (error) {
      console.error('RPC Logout Error:', error);
    }
  }
});

const sidebarHTML = `
  <div id="infinity-settings-sidebar">
    <h2>Infinity Settings</h2>
    <button id="toggle-rpc" onclick="toggleRPC()">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="#7289DA" width="16" height="16">
  <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"/>
</svg>
      <span id="rpc-status">Turn RPC off</span>
    </button>
  </div>ipcMain.handle('rpc-toggle', async (event, enable) => {
  if (enable) {
    try {
      await rpcClient.login({ clientId });
    } catch (error) {
      console.error('RPC Login Error:', error);
    }
  } else {
    try {
      await rpcClient.clearActivity();
      await rpcClient.destroy();
    } catch (error) {
      console.error('RPC Logout Error:', error);
    }
  }
});
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
    
    // Communicate with the main process
    await window.electronAPI.rpcToggle(rpcEnabled);
  }
`;

// Setup Discord Rich Presence
rpc.register(clientId);
rpcClient.on('ready', () => {
  console.log('Discord Rich Presence is ready.');

  const updateActivity = (gameTitle) => {
    rpcClient.setActivity({
      details: 'GeForce Infinity',
      state: gameTitle ? `Playing ${gameTitle}` : 'Idling...',
      largeImageKey: 'infinity_logo', // Ensure 'bluenvidia.png' is included in your app's resources
      largeImageText: 'GeForce Infinity',
      instance: false,
      startTimestamp: startTime, // Start time for elapsed time
    });
  };

  // Initial activity update
  startTime = new Date();
  updateActivity(null);

  // Update activity every 15 seconds
  setInterval(() => {
    const title = mainWindow.getTitle();
    const gameTitle = title.startsWith('GeForce Infinity | ') ? title.replace('GeForce Infinity | ', '') : '';
    updateActivity(gameTitle);
  }, 15 * 1000);
});

function injectCustomCSS() {
  const customCSS = `
    .mat-flat-button.mat-accent,
    .mat-raised-button.mat-accent,
    .mat-fab.mat-accent,
    .mat-mini-fab.mat-accent {
      background-color: #0089ff !important;
    }
    .marquee-indicators[_ngcontent-ng-c3853869388] li.active[_ngcontent-ng-c3853869388] {
      background-color: #6e86ff !important;
    }
    .evidence-panel-highlighter[_ngcontent-ng-c4181549079] {
      background-color: #4aa3ff !important;
    }
    .font-body2-link {
      color: #0089ff !important;
    }
    .left-panel-container[_ngcontent-ng-c2678379996] {
      border-right: 10px ridge #10b2ff !important;
    }
    div.green-circle {
      background-color: #4aa3ff !important;
    }
    .mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
      caret-color: #00b6ff !important;
    }
    .theme-noir mat-form-field:not(.ng-valid .mat-form-field-invalid).mat-focused .mat-mdc-input-element {
      border-color: #0089ff !important;}
    .btn.alt-btn{
    border-color: #0089ff !important; }
    .ng-valid{
      border-color: #3113ff !important;
}
   .btn:disabled {
    background-color: #333;
    color: #666; }
    .btn{
      background: #0de0ff !importannt}
    .btn:hover{
      background-color: #4aa3ff !important}
    .theme-noir{
--mdc-checkbox-selected-focus-icon-color: #0bfdff !important;
--mdc-checkbox-selected-hover-icon-color: #0bfdff !important;
--mdc-checkbox-selected-icon-color: #0bfdff !important;
--mat-minimal-pseudo-checkbox-selected-checkmark-color: #0bfdff !important;
--mdc-checkbox-selected-pressed-icon-color: #0bfdff !important;
--mdc-checkbox-selected-focus-state-layer-color:#001dff !important;
--mdc-checkbox-selected-hover-state-layer-color:#001dff !important;
--mdc-checkbox-selected-pressed-state-layer-color: :#001dff !important;
--mdc-filled-text-field-caret-color: #0bfdff !important;
--mdc-filled-text-field-focus-label-text-color: #0bfdff !important;}
   /* Sidebar CSS */
    #infinity-settings-sidebar {
      position: fixed;
      top: 0;
      right: -300px; /* Sidebar is hidden initially */
      width: 305px;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent grey */
      transition: left 0.3s ease;
      z-index: 5 !important;
      font-family: 'Eurostile', sans-serif;
    }

    #infinity-settings-sidebar h2 {
      color: white;
      padding: 20px;
      font-size: 24px;
    }

    #infinity-settings-sidebar button {
      background-color: transparent;
      border: none;
      color: #7289DA; /* Discord burple */
      cursor: pointer;
      padding: 20px;
      width: 100%;
      display: flex;
      align-items: center;
      transition: background-color 0.3s ease;
    }

    #infinity-settings-sidebar button:hover {
      background-color: #2c2f33; /* Discord dark grey */
    }

    #infinity-settings-sidebar svg {
      margin-right: 10px;
    }

#infinity-settings-sidebar button.rpc-on svg {
  fill: #7289DA; /* Burple */
}

#infinity-settings-sidebar button.rpc-off svg {
  fill: gray;
}

    /* Show the sidebar on hover */
    #infinity-settings-sidebar:hover {
      right: 0px;
    }
  `;

  mainWindow.webContents.insertCSS(customCSS);
}

function createWindow() {


  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    title: 'GeForce Infinity', // Set the initial app title
    icon: path.join(__dirname, 'resources/bluenvidia.png'), // Set the app icon
    webPreferences: {
      contextIsolation: false, // Disable this to allow injected scripts to access DOM
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  mainWindow.loadURL('https://play.geforcenow.com/');

  mainWindow.webContents.openDevTools(); // This line opens the DevTools

  // Set the window to windowed fullscreen mode
  mainWindow.setFullScreenable(true);
  mainWindow.setFullScreen(false); // This makes it windowed fullscreen
  mainWindow.maximize();

  // Inject custom CSS and replace colors once the page has finished loading
  mainWindow.webContents.on('did-finish-load', () => {
    injectCustomCSS();

    mainWindow.webContents.executeJavaScript(`
      const sidebarContainer = document.createElement('div');
      sidebarContainer.innerHTML = \`${sidebarHTML}\`;
      document.body.appendChild(sidebarContainer);
      ${sidebarToggleScript}
    `);
    console.log('Sidebar loaded)')
    // Ensure the title stays as 'GeForce Infinity'
    mainWindow.setTitle('GeForce Infinity');
  });

  // Monitor title changes and modify them
  mainWindow.on('page-title-updated', (event, title) => {
    event.preventDefault();
    let gameName = title.replace(/^GeForce NOW - /, '').replace(/ on GeForce NOW$/, '');
    // Reset to "GeForce Infinity" if the title is "GeForce Infinity | GeForce NOW"
    if (title === 'GeForce Infinity | GeForce NOW' || title === 'GeForce NOW') {
      mainWindow.setTitle('GeForce Infinity');
    } else {
      const modifiedTitle = `GeForce Infinity${gameName ? ' | ' + gameName : ''}`;
      mainWindow.setTitle(modifiedTitle);
    }
  });
}

function createTray() {
  const trayIconPath = path.join(__dirname, 'resources/bluenvidia.png');
  tray = new Tray(trayIconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open GeForce Infinity',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('GeForce Infinity'); // Set tray tooltip
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createTray(); // Initialize tray icon

  globalShortcut.register('Control+I', () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.webContents.executeJavaScript('toggleSidebar();');
    }
  });


  rpcClient.login({ clientId }).catch(console.error);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Record the start time when the app starts
  startTime = new Date();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});