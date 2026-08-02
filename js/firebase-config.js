// js/firebase-config.js
// AquaTrack — Firebase initialization
// Project: aquatrack-f85a4 (console.firebase.google.com)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpccOhhyYbFYDW7klip8ZukA1Y6PSlqzU",
  authDomain: "aquatrack-f85a4.firebaseapp.com",
  projectId: "aquatrack-f85a4",
  storageBucket: "aquatrack-f85a4.firebasestorage.app",
  messagingSenderId: "236779969191",
  appId: "1:236779969191:web:338f4197c180eaf78f9982"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const dbFirestore = getFirestore(app);
