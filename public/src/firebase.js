// Deferred Firebase Runtime Loader — keeps firebase-vendor (~104 KB gzipped) & Auth iframe
// off the critical FCP/LCP render path while hydrating Auth & Cloud Firestore post-paint or on-demand.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let runtimePromise = null;

export function loadFirebaseRuntime() {
  if (runtimePromise) return runtimePromise;
  runtimePromise = (async () => {
    if (!isFirebaseConfigured) {
      return { db: null, auth: null, fs: null, authMod: null, googleProvider: null };
    }
    try {
      const [{ initializeApp }, fs, authMod] = await Promise.all([
        import('firebase/app'),
        import('firebase/firestore'),
        import('firebase/auth'),
      ]);
      const app = initializeApp(firebaseConfig);
      const db = fs.getFirestore(app);
      const auth = authMod.getAuth(app);
      const googleProvider = new authMod.GoogleAuthProvider();
      return { db, auth, fs, authMod, googleProvider };
    } catch (error) {
      console.error('[GeminiPulse] Firebase initialization error:', error);
      return { db: null, auth: null, fs: null, authMod: null, googleProvider: null };
    }
  })();
  return runtimePromise;
}

export async function signInWithGoogle() {
  const { auth, authMod, googleProvider } = await loadFirebaseRuntime();
  if (!auth || !authMod || !googleProvider) {
    throw new Error(
      'Firebase Auth is not yet connected. Once the Firebase project config is added to .env.local, Google Sign-In will authenticate live users.'
    );
  }
  const result = await authMod.signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser() {
  const { auth, authMod } = await loadFirebaseRuntime();
  if (!auth || !authMod) return;
  await authMod.signOut(auth);
}
