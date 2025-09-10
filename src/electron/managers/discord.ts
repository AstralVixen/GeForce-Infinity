import DiscordRPC, { Client as DiscordRPCClient } from "@t0msk/discord-rpc";

export type RpcClient = {
    login: (options: { clientId: string }) => Promise<void>;
    setActivity: (activity: {
        state: string;
        largeImageKey: string;
        largeImageText: string;
        startTimestamp: Date;
    }) => void;
};

export const clientId = "1270181852979789825";
let rpcClient: DiscordRPCClient | undefined;
let startTimestamp: Date;

export function initRpcClient(start: Date, initialTitle: string) {
    startTimestamp = start;
    try {
        rpcClient = new DiscordRPC.Client({ transport: "ipc" });

        if (!rpcClient) return;

        rpcClient.on("ready", () => {
            console.log("Discord RPC connected");
            updateActivity(initialTitle);
        });

        rpcClient.on("error", (err) => {
            console.error("Discord RPC connection error:", err);
            rpcClient = undefined;
        });

        rpcClient.login({ clientId }).catch((err) => {
            console.error("Discord RPC login failed:", err);
            rpcClient = undefined;
        });
    } catch (err) {
        console.error("RPC init error:", err);
        rpcClient = undefined;
    }
}

export function updateActivity(gameTitle: string | null) {
    if (!rpcClient) return;

    try {
        rpcClient.setActivity({
            state: gameTitle ? `Playing ${gameTitle}` : "Idling...",
            largeImageKey: "infinity_logo",
            largeImageText: "GeForce Infinity",
            startTimestamp,
        });
    } catch (err) {
        console.error("Failed to set Discord activity:", err);
        // Disable RPC client on failure to prevent repeated errors
        rpcClient = undefined;
    }
}
