import React from "react";
import type { Config } from "../../shared/types";

import { Header } from "./header";
import { Footer } from "./footer";
import { SettingsSection } from "./settingsSection";
import { ShortcutSection } from "./shortcutSection";
import { ReloadButton } from "./reloadButton";

interface SidebarProps {
    config: Config;
    setConfig: React.Dispatch<React.SetStateAction<Config>>;
    visible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, visible }) => {
    console.log("Sidebar visible:", visible);
    return (
        <div
            className={`fixed top-0 right-0 bottom-0 w-[450px] bg-[#23272b] text-[#babec4] z-[9999] font-sans
        transform transition-transform duration-300 ease-in-out
        ${visible ? "translate-x-0" : "translate-x-full"}
      `}
            style={{ pointerEvents: visible ? "auto" : "none" }}
        >
            <Header />
            <SettingsSection config={config} setConfig={setConfig} />
            <hr className="mx-8 my-4 border-gray-700" />
            <ShortcutSection />
            <ReloadButton />
            <Footer />
        </div>
    );
};

export default Sidebar;
