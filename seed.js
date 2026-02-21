const admin = require('firebase-admin');

// Ideally you would initialize this with a downloaded serviceAccountKey.json 
// from your Firebase project settings -> Service Accounts.
// Example: const serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// For this example, we'll outline the setup assuming standard Application Default Credentials
// if running on a GCP environment or local emulator if configured.
try {
    admin.initializeApp();
} catch (e) {
    console.log("Please authenticate using standard GCP credentials or provide a serviceAccountKey.json");
    console.log("Run: export GOOGLE_APPLICATION_CREDENTIALS=\"/path/to/key.json\"");
    process.exit(1);
}

const db = admin.firestore();

const seedData = [
    {
        title: "Gemini 1.5 Pro Now Available for All Developers",
        summary: "Google has announced that Gemini 1.5 Pro is now generally available via the API, featuring the breakthrough 1M token context window and enhanced reasoning capabilities.",
        date: "2026-02-21",
        tag: "Release",
        link: "#"
    },
    {
        title: "New Code Execution Capabilities Added to Gemini",
        summary: "The Gemini API now natively supports code execution, allowing the model to write and run Python code to solve complex math and logic problems iteratively.",
        date: "2026-02-20",
        tag: "Feature",
        link: "#"
    },
    {
        title: "Community Tutorial: Building Agentic Workflows with Gemini",
        summary: "Learn how to string together multiple Gemini calls to create autonomous agents capable of researching, summarizing, and writing comprehensive reports.",
        date: "2026-02-18",
        tag: "Community",
        link: "#"
    },
    {
        title: "Gemini Nano Gets Multimodal Update on Android",
        summary: "The on-device Gemini Nano model has been updated to understand images and audio, bringing faster, private processing to mobile devices.",
        date: "2026-02-15",
        tag: "Mobile",
        link: "#"
    }
];

async function seed() {
    console.log("Seeding Database...");
    const batch = db.batch();
    const collectionRef = db.collection('pulse_feed');

    seedData.forEach(item => {
        const newDocRef = collectionRef.doc();
        batch.set(newDocRef, item);
    });

    await batch.commit();
    console.log("Seeding complete!");
}

seed().catch(console.error);
