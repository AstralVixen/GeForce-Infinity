import { User } from "firebase/auth";

export const defaultConfig: Config = {
    userAgent: "",
    autofocus: false,
    automute: false,
    notify: true,
    rpcEnabled: true,
    informed: false,
    accentColor: "",
    inactivityNotification: false,
    monitorWidth: 2560,
    monitorHeight: 1440,
    framesPerSecond: 60,
    codecPreference: "auto"
};

export interface Config {
    userAgent: string;
    autofocus: boolean;
    automute: boolean;
    notify: boolean;
    rpcEnabled: boolean;
    informed: boolean;
    accentColor: string;
    inactivityNotification: boolean;
    monitorWidth: number;
    monitorHeight: number;
    framesPerSecond: number;
    codecPreference: "auto" | "h264" | "h265" | "av1";
}

export interface UserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
