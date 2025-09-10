import * as React from "react";
import { createContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Sidebar from "./components/sidebar";
import type { Config } from "../shared/types";
import { defaultConfig } from "../shared/types";
import { User } from "firebase/auth";
import { UserProvider } from "./contexts/UserContext";

let css = "";
try {
    css = window.electronAPI?.getTailwindCss() || "";
} catch (error) {
    console.error("Failed to get Tailwind CSS:", error);
}

if (css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
}

const mount = document.createElement("div");
mount.id = "geforce-infinity-sidebar-root";
document.body.appendChild(mount);

const App = () => {
    const [visible, setVisible] = React.useState(false);
    const [config, setConfig] = useState<Config>(defaultConfig);

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getCurrentConfig().then((config) => {
                setConfig(config);
            }).catch((error) => {
                console.error("Failed to get current config:", error);
            });
            
            window.electronAPI.onConfigLoaded((config: Config) => {
                console.log("Config loaded in overlay:", config);
                setConfig(config);
            });
        } else {
            console.warn("electronAPI not available, using default config");
        }

        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "i") {
                e.preventDefault();
                setVisible((v) => !v);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.saveConfig(config);
        }
    }, [config]);

    return (
        <UserProvider>
            <Sidebar config={config} setConfig={setConfig} visible={visible} />
        </UserProvider>
    );
};

createRoot(mount).render(<App />);
