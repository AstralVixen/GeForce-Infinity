# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.2.0 (2025-09-10)

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

#### Bug Fixes

* **ES Module Imports**: Fixed directory imports with explicit .js extensions for proper module resolution
* **CommonJS Compatibility**: Resolved electron-updater integration issues with ES module architecture
* **Module Path Resolution**: Fixed __dirname references using fileURLToPath for ES module compatibility
* **Import Syntax**: Resolved TypeScript import inconsistencies across the codebase
* **Type Safety**: Enhanced type definitions for better development experience
* **Settings Persistence**: Improved configuration saving and loading reliability
* **Application Startup**: Resolved build and runtime issues preventing application launch

### 1.1.3 (2025-07-28)
