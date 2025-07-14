#!/usr/bin/env sh
echo "[DEBUG] Launching Electron app..."
ls -l /app/share/electron-sample-app/electron
exec electron /app/share/electron-sample-app/electron/main.js "$@"
