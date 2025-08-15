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
    selectedPlatform: "",
    monitorWidth: 1920,
    monitorHeight: 1080,
    framesPerSecond: 60
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
    selectedPlatform: string,
    monitorWidth: number;
    monitorHeight: number;
    framesPerSecond: number;
}

export interface UserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
