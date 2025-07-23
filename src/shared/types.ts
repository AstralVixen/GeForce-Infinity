export const defaultConfig: Config = {
    userAgent: "",
    autofocus: false,
    notify: true,
    rpcEnabled: true,
    informed: false,
    accentColor: "#76b900",
};

export interface Config {
    userAgent: string;
    autofocus: boolean;
    notify: boolean;
    rpcEnabled: boolean;
    informed: boolean;
    accentColor: string;
}
