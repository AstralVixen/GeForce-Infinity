import { registerUpdaterHandlers } from "./updater";
import { registerUserSettingsHandlers } from "./userSettings";
import { registerSidebarIpcHandlers } from "./sidebar";
import { registerPlatformIpcHandlers } from "./platform";
import { registerStartedPlatformHandlers } from "./started";


import type { AppContext } from "../types/context";

export function registerIpcHandlers(deps: AppContext) {
    registerUpdaterHandlers(deps);
    registerUserSettingsHandlers(deps);
    registerSidebarIpcHandlers(deps.mainWindow);
    registerPlatformIpcHandlers(deps.mainWindow);
    registerStartedPlatformHandlers(deps.mainWindow);
}

module.exports = { registerIpcHandlers };
