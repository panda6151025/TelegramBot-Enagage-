// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSTRRsmOuPTIyPQVl-goYLq_b0SBSWx0E",
    authDomain: "engagebot-225ad.firebaseapp.com",
    projectId: "engagebot-225ad",
    storageBucket: "engagebot-225ad.appspot.com",
    messagingSenderId: "777666991644",
    appId: "1:777666991644:web:afce2947cafe3fcf5f71d9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);

export { db };
