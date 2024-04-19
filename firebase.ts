// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-ArGWOJNeCJQS1V2nUzMRVkN30p-KjE8",
  authDomain: "netflix12-7eac0.firebaseapp.com",
  projectId: "netflix12-7eac0",
  storageBucket: "netflix12-7eac0.appspot.com",
  messagingSenderId: "963799088311",
  appId: "1:963799088311:web:17fb46cfbf7cab0b1f6132",
  measurementId: "G-8TP7MC43C1" 
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };
