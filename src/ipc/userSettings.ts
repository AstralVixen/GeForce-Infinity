import { ipcMain, shell } from 'electron';

interface Config {
  autofocus: boolean;
  notify: boolean;
  rpcEnabled: boolean;
  informed: boolean;
}

export function registerUserSettingsHandlers({
  saveConfig,
}: {
  saveConfig: (updates: Partial<Config>) => void;
}) {
  ipcMain.on('open-external-link', (_e, url: string) => shell.openExternal(url));
  ipcMain.on('set-autofocus', (_e, v: boolean) => {
    saveConfig({ autofocus: v });
  });
  ipcMain.on('set-notify', (_e, v: boolean) => {
    saveConfig({ notify: v });
  });
}
