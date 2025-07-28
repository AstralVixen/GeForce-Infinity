import React, { createContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Sidebar from "./components/sidebar";
import type { Config } from "../shared/types";
import { defaultConfig } from "../shared/types";
import { User } from "firebase/auth";
import { UserProvider } from "./contexts/UserContext";

const css = window.electronAPI.getTailwindCss();

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

const mount = document.createElement("div");
mount.id = "geforce-infinity-sidebar-root";
document.body.appendChild(mount);

const App = () => {
    const [visible, setVisible] = React.useState(false);
    const [config, setConfig] = useState<Config>(defaultConfig);

    useEffect(() => {
        window.electronAPI.getCurrentConfig().then((config) => {
            setConfig(config);
        });
        window.electronAPI.onConfigLoaded((config: Config) => {
            console.log("Config loaded in overlay:", config);
            setConfig(config);
        });

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
        window.electronAPI.saveConfig(config);
    }, [config]);

    return (
        <UserProvider>
            <Sidebar config={config} setConfig={setConfig} visible={visible} />
        </UserProvider>
    );
};

createRoot(mount).render(<App />);
