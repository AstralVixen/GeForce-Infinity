export const defaultConfig: Config = {
    userAgent: "",
    autofocus: false,
    notify: true,
    rpcEnabled: true,
    informed: false,
    accentColor: "",
    inactivityNotification: false,
};

export interface Config {
    userAgent: string;
    autofocus: boolean;
    notify: boolean;
    rpcEnabled: boolean;
    informed: boolean;
    accentColor: string;
    inactivityNotification: boolean;
}
