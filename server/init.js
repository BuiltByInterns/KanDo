// Load environment variables first
require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;

async function startServer() {
    // Dynamically import Firebase SDK (ESM)
    const { initializeApp } = await import("firebase/app");
    const { getAnalytics, isSupported } = await import("firebase/analytics");

    // Firebase config using env vars
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: "kanban-8fa1f",
        storageBucket: "kanban-8fa1f.firebasestorage.app",
        messagingSenderId: "904725701653",
        appId: process.env.FIREBASE_APP_ID,
        measurementId: "G-1QELV0Q2HZ",
    };

    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);

    // Initialize Analytics only if supported (won't run in Node)
    if (await isSupported()) {
        const analytics = getAnalytics(firebaseApp);
        console.log("Firebase Analytics initialized");
    } else {
        console.log("Firebase Analytics is not supported in this environment.");
    }

    // Express route
    app.get("/", (req, res) => {
        res.send("Hello, world!");
    });

    // Start server
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

startServer().catch(console.error);