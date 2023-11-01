// Import the functions you need from the SDKs you need
import { initializeApp, firestore } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdoIbJ4Pv8pBhdNjXonNEbB4BFmRLjroI",
  authDomain: "homeautomation-4af1c.firebaseapp.com",
  databaseURL: "https://homeautomation-4af1c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "homeautomation-4af1c",
  storageBucket: "homeautomation-4af1c.appspot.com",
  messagingSenderId: "461594337801",
  appId: "1:461594337801:web:df4d57542b0ebe5e124ed8",
  measurementId: "G-MWJNR1EQRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = firestore()

export {
  db,
  analytics
}