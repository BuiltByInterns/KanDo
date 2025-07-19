// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const env = require('dotenv').config();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: env.FIREBASE_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: "kanban-8fa1f",
  storageBucket: "kanban-8fa1f.firebasestorage.app",
  messagingSenderId: "904725701653",
  appId: env.FIREBASE_APP_ID,
  measurementId: "G-1QELV0Q2HZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);