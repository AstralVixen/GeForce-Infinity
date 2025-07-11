export const defaultConfig: Config = {
    autofocus: false,
    notify: true,
    rpcEnabled: true,
    informed: false,
    accentColor: "",
};

export interface Config {
    autofocus: boolean;
    notify: boolean;
    rpcEnabled: boolean;
    informed: boolean;
    accentColor: string;
}
