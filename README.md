# GeForce Infinity

<p align="center">
  <img src="src/assets/resources/infinity_promoimg.png" alt="Logo" />
</p>

**GeForce Infinity** is a next-generation application designed to enhance the GeForce NOW experience. Originally created to address the lack of native GeForce NOW support on Linux, this app also provides functionality for macOS and Windows users. Built with modern TypeScript, React, and Electron technologies with full ES module support, our goal is to refine the user interface and offer custom features for an improved gaming experience.

## **Screenshots**

![Screenshot](src/assets/resources/Screenshot1.png)

<p align="center">
  <img src="src/assets/resources/Screenshot3.png" width="49%">
  <img src="src/assets/resources/Screenshot4.png" width="49%">
</p>

## 🚀 **Features**

- **Up to 120 FPS support (GFN ultimate required)**
- **4K/5K resolution support** - Full support for 3840x2160 (4K) and 5120x2880 (5K) resolutions
- **Ultrawide monitor support** - Native 3440x1440 (21:9 aspect ratio) ultrawide gaming
- **Advanced codec selection** - Choose between H.264, H.265/HEVC, and AV1 for optimal streaming quality
- **Up to 2K resolution support (GFN performance or up required)**
- **30FPS support (GFN performance or up required for some reason)**
- **720p resolution support (GFN performance or up required for some reason)**
- **Account system:** Users can now register and log in. After logging in, they are able to sync settings to and from the cloud.
- **User dropdown menu in the header.**
- **Inactivity notification:** Alerts you when you're about to be kicked due to inactivity.
- **Automute:** Mutes the game when the window is not in focus.
- **Auto refocus:** Alt-tabs you back into the game if you're unfocused when inactivity timer starts (both autofocus and inactivity notifications must be enabled).
- **Button to reset all settings to their default values.**
- **Support for smaller screens:** added scrollable areas.
- **Info tooltips added in the settings section.**
- **Enhanced UI**: GeForce Infinity aims to improve the user interface of GeForce NOW, providing a more intuitive and enjoyable experience.
- **Custom Discord Rich Presence**: Show off your gaming status with personalized Discord Rich Presence. Display game details and status updates directly in your Discord profile.
- **Instant App Switch**: Automatically switch to GeForce Infinity once your gaming rig is ready for action!
- **Notifications**: Get notified once your gaming rig is ready for action!

## 🛠️ **Planned Features**

We have several exciting features planned to further enhance your experience:

- **HDR support**
- **Surround sound support**
- **Ability to open sidebar during gameplay**
- **Account Switching**: Easily switch between different connected accounts within GeForce NOW.
- **Automatic Game Startup**: Customize which game starts automatically when the app launches.

## ⚠️ **Disclaimer**

GeForce Infinity is an independent project and is not affiliated with, sponsored by, or endorsed by Nvidia or GeForce NOW. All trademarks and logos used are the property of their respective owners. The app is provided as-is, and the developers are not responsible for any issues or damages that may arise from its use.

## 📦 **Installation**

Visit our [Release](https://github.com/doublegate/GeForce-Infinity/releases) page, where you can find newest builds of GeForce Infinity in packages like: **zip** (binary version), **deb**, **AppImage**, **rpm** and **exe**.

You can also download it from our [website](https://geforce-infinity.xyz/).

We also provide installation via **Flatpak** (hosted at Flathub) and **AUR**.

[![Get it from the AUR](src/assets/resources/aur.png)](https://aur.archlinux.org/packages?O=0&K=geforce-infinity) [![Get it from FlatHub](src/assets/resources/flathub.png)](https://flathub.org/apps/io.github.astralvixen.geforce-infinity)

## 🎮 **Usage**

Press `Ctrl+I` to open sidebar to access GeForce Infinity features.

## 💻 **How to use 4K/Ultrawide & 120 FPS streaming**

Press `Ctrl+I` to open sidebar and configure your preferred settings:

### **Resolution Settings**
- **1440p**: 2560x1440 standard QHD
- **Ultrawide**: 3440x1440 for 21:9 ultrawide monitors
- **4K**: 3840x2160 for 4K displays
- **5K**: 5120x2880 for high-end displays

### **Codec Selection**
- **Auto (Recommended)**: Automatically selects best codec for your connection
- **H.264 (Legacy)**: Wide compatibility, lower bandwidth
- **H.265/HEVC**: Better compression, improved quality
- **AV1 (4K Optimized)**: Latest codec, optimal for 4K streaming

### **Frame Rate Options**
- **30 FPS**: Standard streaming
- **60 FPS**: Smooth gaming (Performance plan or higher)
- **120 FPS**: Ultra-smooth gaming (Ultimate plan required)

**IMPORTANT**: Do **NOT** use native GeForce NOW settings for resolution and FPS. GeForce Infinity overrides these values. The native GeForce NOW interface will still show 1080p max resolution and 60 FPS, but GeForce Infinity applies your custom settings.

## 🔧 **Technical Architecture**

GeForce Infinity is built with modern web technologies and follows best practices for cross-platform development:

- **ES Module Architecture**: Full ES module support with modern import/export syntax
- **TypeScript**: Strict type checking and modern language features
- **Electron**: Cross-platform desktop application framework with secure IPC
- **React**: Component-based UI for the overlay interface
- **Build System**: Modern build pipeline with esbuild, TypeScript compiler, and Tailwind CSS

### **Recent Improvements (v1.3.0) - Updated September 10, 2025**
- **ES Module Compatibility**: Complete migration to ES modules with proper directory imports and extensions
- **4K/AV1 Support**: Advanced codec selection with AV1 optimization for 4K streaming performance
- **TypeScript Modernization**: Enhanced type safety with modern import/export syntax throughout codebase
- **Build System Reliability**: Resolved Tailwind CSS compilation issues and all TypeScript errors
- **Dependency Management**: Fixed corrupted yaml package dependency affecting build pipeline
- **Development Experience**: Streamlined development workflow with reliable build processes
- **Resolution Override Timing**: Fixed critical timing issue ensuring GeForce NOW API interception works correctly
- **Discord RPC Stability**: Enhanced error handling preventing application crashes from RPC connection failures
- **Renderer Reliability**: Improved overlay script loading with better error handling and timing optimization
- **Repository Migration**: Complete transition from AstralVixen to doublegate GitHub account

## 🛠️ **Build**

To get started with GeForce Infinity, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/doublegate/GeForce-Infinity.git
    ```

2. Navigate to the project directory:

    ```bash
    cd GeForce-Infinity
    ```

3. Install dependencies:

    ```bash
    yarn install
    ```

4. Run the application:
    ```bash
    yarn start
    ```

## 💬 **Contributing**

We welcome contributions from the community! For the contribution guide please see: [Contributing](CONTRIBUTING.md)

## 📜 **License**

GeForce Infinity is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for more details.

## 📫 **Contact**

For questions, feedback, or suggestions, feel free to reach out to me:

- [GitHub Issues](https://github.com/doublegate/GeForce-Infinity/issues)
- Email: [doublegate@users.noreply.github.com](mailto:doublegate@users.noreply.github.com)
- Discord: [Join my discord](https://discord.gg/p5vRgQwZ9K)
