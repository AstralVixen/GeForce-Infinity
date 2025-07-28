export const defaultConfig: Config = {
    userAgent: "",
    autofocus: false,
    automute: false,
    notify: true,
    rpcEnabled: true,
    informed: false,
    accentColor: "",
};

export interface Config {
    userAgent: string;
    autofocus: boolean;
    automute: boolean;
    notify: boolean;
    rpcEnabled: boolean;
    informed: boolean;
    accentColor: string;
}
