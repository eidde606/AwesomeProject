import { initializeApp } from "firebase/app";
import { getAuth, getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2aVfcQmY1zyvapZ-e87tQaM8LgviBYCY",
  authDomain: "life-goals-70379.firebaseapp.com",
  projectId: "life-goals-70379",
  storageBucket: "life-goals-70379.appspot.com",
  messagingSenderId: "59709928380",
  appId: "1:59709928380:web:362fa6148ad96cd22771b9",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
