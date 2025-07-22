import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../lib/firebase";

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
      accentColor: data.gfiaccent ?? "#000000",
      notify: data.gfinotificaitons ?? true,
      autofocus: data.gfiautofocus ?? true,
      informed: data.gfinformed ?? false,
    };

    // Save to disk via exposed IPC
    window.electronAPI.saveConfig(configUpdate);

    console.log("✅ Synced config from cloud.");
  } catch (err) {
    console.error("❌ Failed to sync from cloud:", err);
  }
}
