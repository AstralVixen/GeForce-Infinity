import { Config } from "../shared/types";

export {};

declare global {
    interface Window {
        electronAPI: {
            onSidebarToggle: (callback: () => void) => void;
            openExternal: (url: string) => void;
            saveConfig: (config: Partial<Config>) => void;
            onConfigLoaded: (callback: (config: Config) => void) => void;
        };
    }
}
