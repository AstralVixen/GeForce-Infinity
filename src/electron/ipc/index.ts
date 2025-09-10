import { registerUpdaterHandlers } from "./updater.js";
import { registerUserSettingsHandlers } from "./userSettings.js";
import { registerSidebarIpcHandlers } from "./sidebar.js";

import type { AppContext } from "../types/context.js";

export function registerIpcHandlers(deps: AppContext) {
    registerUpdaterHandlers(deps);
    registerUserSettingsHandlers(deps);
    registerSidebarIpcHandlers(deps.mainWindow);
}
