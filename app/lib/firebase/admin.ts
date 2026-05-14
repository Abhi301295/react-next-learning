import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/** Normalize .env.local quirks: BOM, surrounding single quotes, stray whitespace. */
function normalizeServiceAccountJsonInput(raw: string): string {
  let s = raw.trim();
  if (s.charCodeAt(0) === 0xfeff) {
    s = s.slice(1).trimStart();
  }
  if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function initAdminApp() {
  if (getApps().length > 0) return;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON is not set. Add your Firebase service account JSON (single line) to .env.local."
    );
  }

  const normalized = normalizeServiceAccountJsonInput(raw);
  let parsed: ServiceAccount;
  try {
    parsed = JSON.parse(normalized) as ServiceAccount;
  } catch (first) {
    try {
      parsed = JSON.parse(
        normalized.replace(/\u201c|\u201d/g, '"')
      ) as ServiceAccount;
    } catch {
      const hint =
        "FIREBASE_SERVICE_ACCOUNT_JSON must be one line of valid JSON. In .env.local wrap the whole value in single quotes, e.g. FIREBASE_SERVICE_ACCOUNT_JSON='{\"type\":\"service_account\",...}'. Do not paste the key across multiple lines unless your loader supports it.";
      throw new Error(
        first instanceof Error
          ? `${hint} (parse error: ${first.message})`
          : `${hint} (parse error.)`
      );
    }
  }

  initializeApp({
    credential: cert(parsed),
  });
}

export function getAdminAuth() {
  initAdminApp();
  return getAuth();
}

export function getAdminFirestore() {
  initAdminApp();
  return getFirestore();
}
