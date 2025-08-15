declare module "@t0msk/discord-rpc" {
    const DiscordRPC: any;
    export default DiscordRPC;

    export type Client = {
        new (options?: { transport: string }): any;
        on: (event: string, listener: (...args: any[]) => void) => void;
        login: (options: { clientId: string }) => Promise<void>;
        setActivity: (activity: {
            state: string;
            largeImageKey: string;
            largeImageText: string;
            startTimestamp: Date;
        }) => void;
    };
}
