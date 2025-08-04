import { registerUpdaterHandlers } from "./updater";
import { registerUserSettingsHandlers } from "./userSettings";
import { registerSidebarIpcHandlers } from "./sidebar";
import { registerPlatformIpcHandlers } from "./platform";

import type { AppContext } from "../types/context";

export function registerIpcHandlers(deps: AppContext) {
    registerUpdaterHandlers(deps);
    registerUserSettingsHandlers(deps);
    registerSidebarIpcHandlers(deps.mainWindow);
    registerPlatformIpcHandlers(deps.mainWindow);
}

module.exports = { registerIpcHandlers };
