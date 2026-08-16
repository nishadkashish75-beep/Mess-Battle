// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy7sTJFVbQpdA0kHzHS-cYY4JesA5jRXI",
  authDomain: "mess-battle.firebaseapp.com",
  projectId: "mess-battle",
  storageBucket: "mess-battle.firebasestorage.app",
  messagingSenderId: "656256406360",
  appId: "1:656256406360:web:95a6a066e100b5727dcb2d",
  measurementId: "G-C4N8YJMB2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);