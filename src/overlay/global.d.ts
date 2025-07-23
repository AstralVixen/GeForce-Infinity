import type { Config } from "../shared/types";

declare global {
    interface Window {
        electronAPI: {
            onSidebarToggle: (callback: () => void) => void;
            openExternal: (url: string) => void;
            saveConfig: (config: Partial<Config>) => void;
            getCurrentConfig: () => Promise<Config>;
            onConfigLoaded: (callback: (config: Config) => void) => void;
            getTailwindCss: () => string;
            reloadGFN: () => void;
        };
    }
}
