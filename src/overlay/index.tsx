import "./index.css";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Sidebar from "./components/sidebar";
import type { Config } from "../shared/types";
import { defaultConfig } from "../shared/types";

const mount = document.createElement("div");
mount.id = "geforce-infinity-sidebar-root";
document.body.appendChild(mount);

const App = () => {
    const [visible, setVisible] = React.useState(false);
    const [config, setConfig] = useState<Config>(defaultConfig);

    useEffect(() => {
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
