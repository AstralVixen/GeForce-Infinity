const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  rpcToggle: (enable) => ipcRenderer.invoke('rpc-toggle', enable)
});
