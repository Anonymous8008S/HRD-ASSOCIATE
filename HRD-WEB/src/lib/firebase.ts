import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBV0jhhktfrPE7KM6UPpmqPwiqjQjUtjOY",
  authDomain: "test-4bcc8.firebaseapp.com",
  projectId: "test-4bcc8",
  storageBucket: "test-4bcc8.firebasestorage.app",
  messagingSenderId: "345615123079",
  appId: "1:345615123079:web:3def5647c41adcc9c06e22",
  measurementId: "G-JN3TJNDCQE"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;