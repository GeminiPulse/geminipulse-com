import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// (Using generic config assuming standard Firebase hosting auto-injects, 
// or user drops config here later for local dev)
const firebaseConfig = {
    // Config goes here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
