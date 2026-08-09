import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKuyJruGbsCkFxA-HSA6IqVyS0_evaQo4",
  authDomain: "splitbugs-web.firebaseapp.com",
  projectId: "splitbugs-web",
  storageBucket: "splitbugs-web.firebasestorage.app",
  messagingSenderId: "563961402142",
  appId: "1:563961402142:web:59886afb902baa9dcdef0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
