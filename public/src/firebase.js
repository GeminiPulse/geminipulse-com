import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// Reads VITE_FIREBASE_* environment variables when configured (.env.local, never committed to git)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
export let db = null;
export let auth = null;
export let googleProvider = null;
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    console.info(
      '[GeminiPulse] Running in Local Preview Mode (VITE_FIREBASE_PROJECT_ID not set). Public posting is gated behind Google Sign-In.'
    );
  }
} catch (error) {
  console.error('[GeminiPulse] Firebase initialization error:', error);
}

export async function signInWithGoogle() {
  if (!auth || !googleProvider) {
    throw new Error(
      'Firebase Auth is not yet connected. Once the Firebase project config is added to .env.local, Google Sign-In will authenticate live users.'
    );
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser() {
  if (!auth) return;
  await signOut(auth);
}

export { onAuthStateChanged };
