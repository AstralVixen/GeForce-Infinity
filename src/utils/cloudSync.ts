import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../lib/firebase";
import type { Config } from "../shared/types";

const db = getFirestore();

export async function syncFromCloud() {
    const user = auth.currentUser;
    if (!user) {
        console.warn("No authenticated user to sync from.");
        return;
    }

    try {
        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            console.warn("No cloud config found.");
            return;
        }

        const data = snapshot.data();

        // Map to local config
        const configUpdate = {
            rpcEnabled: data.gfirpc ?? true,
            userAgent: data.gfiuseragent ?? "",
            accentColor: data.gfiaccent ?? "",
            notify: data.gfinotificaitons ?? true,
            inactivityNotification: data.gfiinactivitynotification ?? false,
            autofocus: data.gfiautofocus ?? false,
            automute: data.gfiautomute ?? false,
            informed: data.gfinformed ?? false,
        };

        // Save to disk via exposed IPC
        window.electronAPI.saveConfig(configUpdate);

        console.log("✅ Synced config from cloud.");
    } catch (err) {
        console.error("❌ Failed to sync from cloud:", err);
    }
}

export async function syncToCloud(config: Config) {
    const user = auth.currentUser;
    if (!user) {
        console.warn("No authenticated user to sync with.");
        return;
    }

    try {
        const docRef = doc(db, "users", user.uid);

        const userData = {
            username: user.displayName || user.email || "Unknown",
            gfirpc: config.rpcEnabled,
            gfiuseragent: config.userAgent,
            gfitheme: "", // TODO: theme system later
            gfiaccent: config.accentColor,
            gfinotificaitons: config.notify,
            gfiinactivitynotification: config.inactivityNotification,
            gfiautofocus: config.autofocus,
            gfiautomute: config.automute,
            gfinformed: config.informed,
            patreonSub: false,
        };

        await setDoc(docRef, userData, { merge: true });

        console.log("Cloud sync complete ✅");
    } catch (err) {
        console.error("Failed to sync to cloud:", err);
    }
}
