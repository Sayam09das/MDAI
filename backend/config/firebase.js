import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    try {
      return JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf-8"));
    } catch (err) {
      throw new Error(`Invalid FIREBASE_SERVICE_ACCOUNT_B64: ${err.message}`);
    }
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const fallbackPath = path.resolve(__dirname, "..", "firebase-service-account.json");

  if (fs.existsSync(fallbackPath)) {
    try {
      const raw = fs.readFileSync(fallbackPath, "utf8");
      return JSON.parse(raw);
    } catch (err) {
      throw new Error(`Invalid firebase-service-account.json: ${err.message}`);
    }
  }

  throw new Error("❌ FIREBASE_SERVICE_ACCOUNT_B64 missing and firebase-service-account.json not found");
}

const serviceAccount = loadServiceAccount();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("🔥 Firebase Admin Initialized");

export default admin;
