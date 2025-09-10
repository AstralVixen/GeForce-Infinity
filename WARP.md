# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick Start

```bash path=null start=null
# Clone and install
git clone https://github.com/AstralVixen/GeForce-Infinity.git
cd GeForce-Infinity
yarn install

# Start development
yarn dev

# Build and run
yarn build && yarn start
```

## Architecture Overview

GeForce Infinity is an Electron application that enhances the GeForce NOW experience through an overlay injection system. The application loads the GeForce NOW web app and injects a React-based sidebar for custom controls.

```
┌─────────────────────────────────────┐
│           Electron Main Process     │
│  - App lifecycle & window creation  │
│  - IPC handlers (ipcMain)          │
│  - Discord Rich Presence           │
│  - Config & cloud sync management  │
│  - Tray & notifications            │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│          Preload Script             │
│  - Context bridge (electronAPI)    │
│  - Safe API exposure               │
│  - DOM injection bootstrap        │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│    GeForce NOW Web App (renderer)   │
│  + React Overlay (injected sidebar) │
│  - React + TypeScript + Tailwind   │
│  - Settings UI & controls          │
│  - User authentication            │
│  - FPS/resolution override        │
└─────────────────────────────────────┘
```

## Repository Structure

```
src/
├── electron/               # Main process code
│   ├── main.ts            # App entry point
│   ├── preload.ts         # Context bridge & API exposure
│   ├── utils.ts           # Electron utilities
│   ├── ipc/               # IPC handlers
│   ├── managers/          # App managers (config, discord, window, tray)
│   └── types/             # TypeScript definitions
├── overlay/               # React overlay (injected into GFN)
│   ├── index.tsx          # Overlay entry point
│   ├── index.css          # Tailwind styles
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   └── hooks/             # Custom hooks
├── shared/                # Shared types & utilities
│   └── types.ts           # Common TypeScript interfaces
├── lib/                   # External integrations
│   └── firebase.ts        # Firebase config
├── utils/                 # Utility functions
│   └── cloudSync.ts       # Cloud synchronization
└── assets/                # Static assets
    └── infinity-styles.css # Custom CSS styles
```

## Development Commands

### Installation
```bash path=null start=null
yarn install
```

### Development
```bash path=null start=null
# Run development mode (Electron + overlay with hot reload)
yarn dev

# Development overlay only
yarn dev:overlay

# Watch TypeScript compilation for Electron
yarn dev:electron
```

### Building
```bash path=null start=null
# Build everything (CSS + overlay + electron)
yarn build

# Build individual components
yarn run scripts/build-css.ts      # Tailwind CSS compilation
yarn run scripts/build-overlay.ts  # React overlay (esbuild)
yarn run scripts/build-electron.ts # TypeScript compilation
```

### Running
```bash path=null start=null
# Build and run the application
yarn start

# Package for distribution
yarn pack    # Package without publishing
yarn dist    # Create distributables (Windows + Linux)
```

### Quality Assurance
```bash path=null start=null
# Linting
yarn lint

# Note: Tests are not yet implemented
yarn test  # Currently returns error - no tests specified
```

## Build Pipeline Details

### TypeScript Compilation
- **Config**: `tsconfig.electron.json`
- **Target**: ESNext with Node16 modules
- **Output**: `dist/` directory
- **Includes**: Electron main process and preload script

### React Overlay Build
- **Bundler**: esbuild
- **Entry**: `src/overlay/index.tsx`
- **Output**: `dist/overlay/`
- **Features**: ESM format, code splitting, minification, React JSX automatic runtime

### Tailwind CSS Pipeline
- **Input**: `src/overlay/index.css`
- **Output**: `dist/assets/tailwind.bundle.css`
- **Config**: `tailwind.config.js` with custom plugins
- **PostCSS**: Configured in `postcss.config.js`

## Overlay Injection Architecture

The application injects a React-based sidebar into the GeForce NOW website:

1. **Injection Trigger**: Ctrl+I keyboard shortcut toggles sidebar visibility
2. **DOM Mounting**: Creates `#geforce-infinity-sidebar-root` element
3. **Style Isolation**: Tailwind CSS compiled separately to avoid conflicts
4. **State Management**: Uses React Context for user authentication and settings
5. **IPC Communication**: Overlay communicates with main process via `electronAPI`

Key features controlled by overlay:
- Resolution override (up to 2K)
- FPS override (up to 120 FPS) 
- User authentication & cloud sync
- Discord Rich Presence toggle
- Auto-mute and auto-focus settings
- Inactivity notifications

## Package Management

The project uses **Yarn** as the primary package manager (evidenced by `yarn.lock`). Although `package-lock.json` exists, all scripts and documentation reference Yarn commands.

**Key Dependencies:**
- **Runtime**: Electron 37.x, React 18, Firebase 12, Discord RPC
- **Build Tools**: TypeScript 5.x, esbuild, Tailwind CSS 3.4.x
- **Development**: ESLint, Prettier, electron-builder

## Distribution & Packaging

Uses `electron-builder` for creating distributables:

```bash path=null start=null
# Create platform-specific packages
yarn dist  # Builds for Windows and Linux

# Available formats:
# - Windows: NSIS installer, ZIP
# - Linux: AppImage, DEB, RPM, ZIP
```

**Output Location**: `builds/` directory
**App ID**: `net.astralvixen.geforceinfinity`

## Code Style & Contribution Guidelines

### Formatting Standards
- **Prettier** with tab width 4
- **ESLint** with TypeScript support
- Format on save recommended in VSCode

### Branch Strategy
- Create feature branches: `feature/your-feature-name` or `fix/your-fix-name`
- All PRs require approval from both @AstralVixen and @t0msk

### Pre-commit Checklist
- Format code with Prettier (tab width 4)
- Run ESLint and fix warnings
- Ensure TypeScript compilation passes
- Test overlay functionality with Ctrl+I

### Commit Guidelines
- Use clear, descriptive commit messages
- Reference related issues in PR descriptions
- Keep changes focused and atomic

## Configuration Files

- `tsconfig.electron.json` - TypeScript configuration for Electron
- `tailwind.config.js` - Tailwind CSS configuration  
- `postcss.config.js` - PostCSS processing
- `.eslintrc.cjs` - ESLint rules and TypeScript integration
- `electron-builder` config in `package.json`

## Troubleshooting

### Common Issues
1. **Overlay not appearing**: Check if Ctrl+I shortcut is registered and working
2. **Build failures**: Ensure Bun is available for build scripts
3. **TypeScript errors**: Check `tsconfig.electron.json` includes the right paths
4. **Styling conflicts**: Verify Tailwind compilation and class scoping

### Debug Mode
- Development builds enable DevTools automatically
- Uncomment `mainWindow.webContents.openDevTools()` in `window.ts` for persistent DevTools

## Key Features Architecture

### Discord Rich Presence
- Managed in `src/electron/managers/discord.ts`
- Uses `@t0msk/discord-rpc` package
- Configurable through overlay settings

### Cloud Sync
- Firebase integration in `src/lib/firebase.ts`
- User authentication via React Context
- Settings synchronization across devices

### GeForce NOW Enhancements  
- Custom user agent support
- Resolution/FPS override injection
- Color theme patching via DOM manipulation
- Inactivity detection and notifications

This application demonstrates advanced Electron patterns including secure overlay injection, cross-process communication, and external service integration while maintaining a clean, modular architecture.
