#!/bin/sh
echo "Launching Electron..."
exec electron /app/share/electron-sample-app/electron/main.js "$@"
