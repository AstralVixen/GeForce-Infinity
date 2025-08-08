import { contextBridge, ipcRenderer, clipboard, shell } from "electron";
import { Config } from "../shared/types";
import path from "path";
import fs from "fs";

declare global {
	interface Window {
		toggleSidebar: () => void;
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const script = document.createElement("script");
	script.type = "module";
	script.src = "app://overlay/index.js";
	document.body.appendChild(script);
});

const cssPath = path.join(__dirname, "../assets/tailwind.bundle.css");
let tailwindCss = "";
try {
	tailwindCss = fs.readFileSync(cssPath, "utf-8");
} catch (err) {
	console.error("❌ Failed to read Tailwind CSS:", err);
}

contextBridge.exposeInMainWorld("electronAPI", {
	getTailwindCss: () => tailwindCss,
	onSidebarToggle: (callback: () => void) => {
		ipcRenderer.on("sidebar-toggle", (_event, ...args) => {
			callback();
		});
	},
	saveConfig: (config: Partial<Config>) =>
		ipcRenderer.send("save-config", config),
	getCurrentConfig: () => ipcRenderer.invoke("get-config"),
	onConfigLoaded: (callback: (config: Config) => void) => {
		ipcRenderer.on("config-loaded", (event, config) => callback(config));
	},
	reloadPlatform: () => {
		ipcRenderer.send("reload-gfn");
	},
	copyToClipboard: (text: string) => clipboard.writeText(text),
	openExternal: (url: string) => shell.openExternal(url),
	checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
	quitAndInstall: () => ipcRenderer.send("quit-and-install"),
	updateAvailable: (
		callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
	) => ipcRenderer.on("update-available", callback),
	updateDownloaded: (
		callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
	) => ipcRenderer.on("update-downloaded", callback),
	downloadUpdate: () => ipcRenderer.invoke("download-update"),
	launchPlatform: (url: string) => ipcRenderer.send("launch-platform", url),
	rememberPlatform: (platform: string) =>
		ipcRenderer.send("remember-platform", platform),
	notifyPlatformStarted: (platformId: string) =>
		ipcRenderer.send("platform-started", platformId),
	onPlatformStarted: (callback: (platformId: string) => void) =>
		ipcRenderer.on("platform-started", (_event, platformId: string) =>
			callback(platformId)
		),
	getStartedPlatform: () => ipcRenderer.invoke("get-started-platform"),
});
