import { registerUpdaterHandlers } from './updater';
import { registerUserSettingsHandlers } from './userSettings';
import { registerRpcHandlers } from './discordRpc';

import type { AppContext } from '../types';

export function registerIpcHandlers(deps: AppContext) {
  registerUpdaterHandlers(deps);
  registerUserSettingsHandlers(deps);
  registerRpcHandlers(deps);
}

module.exports = { registerIpcHandlers };
