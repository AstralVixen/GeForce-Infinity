# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.3.0 (2025-09-10)

#### Features

* **4K/5K Support**: Added comprehensive 4K (3840x2160) and 5K (5120x2880) resolution support
* **Ultrawide Support**: Native support for 3440x1440 (21:9 aspect ratio) ultrawide gaming monitors
* **Advanced Codec Selection**: Implemented codec preference system with H.264, H.265/HEVC, and AV1 options
* **AV1 Codec**: Added AV1 codec support optimized for 4K streaming performance
* **Resolution Enhancement**: Upgraded default resolution from 1080p to 1440p for better streaming quality

#### Technical Improvements

* **ES Module Architecture**: Complete migration to ES modules with proper directory imports and file extensions
* **TypeScript Modernization**: Updated TypeScript codebase with modern import syntax and improved type safety
* **Build System Enhancement**: Resolved CommonJS/ES module compatibility issues including electron-updater integration
* **Enhanced Settings UI**: Redesigned settings interface with comprehensive resolution and codec options
* **Configuration System**: Expanded configuration schema to support new streaming parameters
* **Code Quality**: Fixed all TypeScript compilation errors and improved overall code reliability
* **Module Resolution**: Fixed __dirname references for ES modules using fileURLToPath and URL constructors
* **Tailwind CSS Reliability**: Resolved corrupted yaml package dependency affecting CSS compilation pipeline
* **Development Workflow**: Streamlined build process with reliable dependency management and error resolution

#### Bug Fixes

* **ES Module Imports**: Fixed directory imports with explicit .js extensions for proper module resolution
* **CommonJS Compatibility**: Resolved electron-updater integration issues with ES module architecture
* **Module Path Resolution**: Fixed __dirname references using fileURLToPath for ES module compatibility
* **Import Syntax**: Resolved TypeScript import inconsistencies across the codebase
* **Type Safety**: Enhanced type definitions for better development experience
* **Settings Persistence**: Improved configuration saving and loading reliability
* **Application Startup**: Resolved build and runtime issues preventing application launch
* **Dependency Corruption**: Fixed corrupted yaml package causing Tailwind CSS compilation failures
* **Build Pipeline**: Stabilized build process with comprehensive error handling and recovery
* **Resolution Override Timing**: Fixed critical issue where fetch patching was applied before GeForce NOW loaded
* **Discord RPC Error Handling**: Added proper connection error management preventing application crashes
* **Renderer Script Execution**: Enhanced overlay loading with improved error handling and timing optimization
* **Repository References**: Complete migration from AstralVixen to doublegate GitHub account across all files
* **IBUS Warnings**: Suppressed Linux GTK input method warnings with proper environment variable configuration
* **Build Script Modernization**: Updated Node.js loader from deprecated --loader to modern --import syntax
* **Request Monitoring Enhancement**: Added comprehensive debugging for GeForce NOW API interception patterns
* **XHR Request Patching**: Extended network interception to handle XMLHttpRequest alongside fetch() for complete coverage
* **Unhandled Promise Rejections**: Implemented proper error handling for Discord RPC connection failures

### 1.1.3 (2025-07-28)
