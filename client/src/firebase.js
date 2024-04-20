// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blogapp-30e06.firebaseapp.com",
  projectId: "mern-blogapp-30e06",
  storageBucket: "mern-blogapp-30e06.appspot.com",
  messagingSenderId: "732663589231",
  appId: "1:732663589231:web:31bc1ff3de9c044fb0209a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
