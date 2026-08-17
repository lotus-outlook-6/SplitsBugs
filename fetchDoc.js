import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

// Need to read the config from src/firebase.js somehow
const firebaseJs = fs.readFileSync("src/firebase.js", "utf8");
const configMatch = firebaseJs.match(/const firebaseConfig = (\{[\s\S]*?\});/);
if (configMatch) {
  const configStr = configMatch[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":').replace(/'/g, '"');
  // Need to eval it carefully or just run an astro script.
}
