import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBV2kjeQ3_hVTMUCALpFGviuu5l_qHE4PY",
  authDomain: "geforce-infinity.firebaseapp.com",
  projectId: "geforce-infinity",
  storageBucket: "geforce-infinity.firebasestorage.app",
  messagingSenderId: "234864377765",
  appId: "1:234864377765:web:0b75e2056d574915e9f24c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);