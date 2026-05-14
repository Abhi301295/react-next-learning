import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

function readPublicConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_* env vars. Copy the web app config from Firebase console into .env.local."
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

let app: FirebaseApp | undefined;

export function getFirebaseClientApp(): FirebaseApp {
  if (!app) {
    const existing = getApps()[0];
    app = existing ?? initializeApp(readPublicConfig());
  }
  return app;
}

export function getFirebaseClientAuth() {
  return getAuth(getFirebaseClientApp());
}
