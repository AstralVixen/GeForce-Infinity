import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../lib/firebase";

const db = getFirestore();

export async function syncToCloud(config: any) {
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
      gfiautofocus: config.autofocus,
      gfinformed: config.informed,
      patreonSub: false,
    };

    await setDoc(docRef, userData, { merge: true });

    console.log("Cloud sync complete ✅");
  } catch (err) {
    console.error("Failed to sync to cloud:", err);
  }
}
