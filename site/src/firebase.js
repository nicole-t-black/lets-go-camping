// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgbcIjbGP6kT6ysgKoC0j0oJEKayAgNMo",
  authDomain: "lets-go-camping-9c1d4.firebaseapp.com",
  projectId: "lets-go-camping-9c1d4",
  storageBucket: "lets-go-camping-9c1d4.firebasestorage.app",
  messagingSenderId: "340282432147",
  appId: "1:340282432147:web:39b0cba14fb3ef96374b66",
  measurementId: "G-MJ2FG2N50G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);