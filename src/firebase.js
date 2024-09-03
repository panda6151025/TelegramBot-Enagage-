// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC8rCYWccX18kxEYIJ_IQAqC4I5B4JqCjI",
    authDomain: "test-88b82.firebaseapp.com",
    projectId: "test-88b82",
    storageBucket: "test-88b82.appspot.com",
    messagingSenderId: "372143716166",
    appId: "1:372143716166:web:37ba3829bd94c1e3f0974",
    measurementId: "G-4YF023GX60"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);

export { db };
