import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// (Using generic config assuming standard Firebase hosting auto-injects, 
// or user drops config here later for local dev)
const firebaseConfig = {
    // Config goes here
};

let app = null;
export let db = null;
export let auth = null;

try {
    // Only initialize if there are actually keys in the config object
    if (Object.keys(firebaseConfig).length > 0 && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
    } else {
        console.warn("No Firebase configuration found. Running in local mock mode.");
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}
