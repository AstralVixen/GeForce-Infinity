const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  rpcToggle: (enable) => ipcRenderer.invoke('rpc-toggle', enable),
  setAutofocus: (enabled) => ipcRenderer.send('set-autofocus', enabled),
  setNotify: (enabled) => ipcRenderer.send('set-notify', enabled),
  copyToClipboard: (text) => clipboard.writeText(text),
  openExternal: (url) => ipcRenderer.send('open-external-link', url)
});
