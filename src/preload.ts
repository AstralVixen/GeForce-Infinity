import { contextBridge, ipcRenderer, clipboard } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    rpcToggle: (enable: unknown) => ipcRenderer.invoke("rpc-toggle", enable),
    setAutofocus: (enabled: unknown) => ipcRenderer.send("set-autofocus", enabled),
    setNotify: (enabled: unknown) => ipcRenderer.send("set-notify", enabled),
    copyToClipboard: (text: string) => clipboard.writeText(text),
    openExternal: (url: unknown) => ipcRenderer.send("open-external-link", url),
    checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
    quitAndInstall: () => ipcRenderer.send("quit-and-install"),
    updateAvailable: (callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => ipcRenderer.on("update-available", callback),
    updateDownloaded: (callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) =>
        ipcRenderer.on("update-downloaded", callback),
    downloadUpdate: () => ipcRenderer.invoke("download-update"),
});
