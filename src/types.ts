import { BrowserWindow } from 'electron';

export interface AppConfig {
  autofocus: boolean;
  notify: boolean;
  rpcEnabled: boolean;
  informed: boolean;
}

export interface AppContext {
  mainWindow: BrowserWindow;
  clientId: string;
  updateActivity: (gameTitle: string | null) => void;
  saveConfig: (updates: Partial<AppConfig>) => void;
}
