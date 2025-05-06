import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  
  apiKey: "AIzaSyBHO86bncRep1c835i9bfu3qOZ0SuxoU-g",
  authDomain: "brainpair.firebaseapp.com",
  projectId: "brainpair",
  storageBucket: "brainpair.firebasestorage.app", // 
  messagingSenderId: "696488391207",
  appId: "1:696488391207:web:8b114c24b8e7e20615d402",
  measurementId: "G-XYBY02YLN3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 
export const analytics = getAnalytics(app);
