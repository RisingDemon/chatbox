// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAl0T2qvco19inxkNzo8JzZ7T_goFSqdu0",
  authDomain: "chatbox-5c450.firebaseapp.com",
  projectId: "chatbox-5c450",
  storageBucket: "chatbox-5c450.appspot.com",
  messagingSenderId: "96813798690",
  appId: "1:96813798690:web:ab8f493d17c3f315cc817b",
  measurementId: "G-64H49M3J56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const firestore = getFirestore();
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
// export { firestore };
export const db= getFirestore(app);
// export const db= app.firestore();
