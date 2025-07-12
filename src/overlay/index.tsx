import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Sidebar from "./components/sidebar";
import type { Config } from "../shared/types";
import { defaultConfig } from "../shared/types";

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
        window.electronAPI.onSidebarToggle(() => {
            console.log("sidebar-toggle event received");
            setVisible((v) => !v);
        });
    }, []);

    return <Sidebar config={config} setConfig={setConfig} visible={visible} />;
};

createRoot(mount).render(<App />);
