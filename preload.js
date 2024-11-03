const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  rpcToggle: (enable) => ipcRenderer.invoke('rpc-toggle', enable),
  setAutofocus: (enabled) => ipcRenderer.send('set-autofocus', enabled),
  setNotify: (enabled) => ipcRenderer.send('set-notify', enabled),
  copyToClipboard: (text) => clipboard.writeText(text),
  openExternal: (url) => ipcRenderer.send('open-external-link', url),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  quitAndInstall: () => ipcRenderer.send('quit-and-install'),
  updateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  updateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
});
