import { app, BrowserWindow, Tray, Menu, Notification, globalShortcut } from 'electron';
import path from 'path';
import fs from 'fs';

import { registerIpcHandlers } from './ipc';


interface Config {
  autofocus: boolean;
  notify: boolean;
  rpcEnabled: boolean;
  informed: boolean;
}

type RpcClient = {
  login: (options: { clientId: string }) => Promise<void>;
  setActivity: (activity: {
    state: string;
    largeImageKey: string;
    largeImageText: string;
    startTimestamp: Date;
  }) => void;
};

const configPath = path.join(app.getPath('userData'), 'settings.json');

let mainWindow: BrowserWindow;
let tray: Tray;
let startTime: Date;
let rpcClient: RpcClient | undefined;

const clientId = '1270181852979789825';

let config: Config = {
  autofocus: false,
  notify: true,
  rpcEnabled: true,
  informed: false,
};

function loadConfig() {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Config;
  } else {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}

function saveConfig(updates: Partial<Config> = {}) {
  config = { ...config, ...updates };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function updateActivity(gameTitle: string | null) {
  if (!rpcClient) return;
  rpcClient.setActivity({
    state: gameTitle ? `Playing ${gameTitle}` : 'Idling...',
    largeImageKey: 'infinity_logo',
    largeImageText: 'GeForce Infinity',
    startTimestamp: startTime,
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    title: 'GeForce Infinity',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL('https://play.geforcenow.com/');

  mainWindow.webContents.on('did-finish-load', () => {
    startTime = new Date();

    if (config.rpcEnabled && rpcClient) {
      rpcClient.login({ clientId }).catch(console.error);
    }

    setInterval(() => {
      const title = mainWindow.getTitle().replace(/^.*\| /, '');
      updateActivity(title || null);
    }, 15_000);
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'resources', 'infinitylogo.png'));
  tray.setToolTip('GeForce Infinity');

  const menu = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setContextMenu(menu);
}

app.whenReady().then(() => {
  loadConfig();

  registerIpcHandlers({
    saveConfig,
    updateActivity,
    clientId,
    mainWindow,
  });

  createWindow();
  createTray();

  const success = globalShortcut.register('Control+I', () => {
    mainWindow.webContents.executeJavaScript('toggleSidebar()');
  });

  if (success && !config.informed) {
    new Notification({
      title: 'GeForce Infinity',
      body: 'Press Ctrl+I to open the sidebar!',
    }).show();

    saveConfig({ informed: true });
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
