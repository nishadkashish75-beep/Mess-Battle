import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAy7sTJFVbQpdA0kHzHS-cYY4JesA5jRXI",
  authDomain: "mess-battle.firebaseapp.com",
  projectId: "mess-battle",
  storageBucket: "mess-battle.firebasestorage.app",
  messagingSenderId: "656256406360",
  appId: "1:656256406360:web:95a6a066e100b5727dcb2d",
  measurementId: "G-C4N8YJMB2W"
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);