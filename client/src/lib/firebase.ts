// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqe7LcTF5lO-k7hdbwqz9e381wrPBPLL8",
  authDomain: "kanban-8fa1f.firebaseapp.com",
  projectId: "kanban-8fa1f",
  storageBucket: "kanban-8fa1f.firebasestorage.app",
  messagingSenderId: "904725701653",
  appId: "1:904725701653:web:07df647202a5e217c85a1c",
  measurementId: "G-1QELV0Q2HZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };