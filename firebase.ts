
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAk2ZFtFLKhjiLSU7rN1qgyZxBS0OWQ9mE",
  authDomain: "doctorrecomend.firebaseapp.com",
  projectId: "doctorrecomend",
  storageBucket: "doctorrecomend.appspot.com",
  messagingSenderId: "858634030357",
  appId: "1:858634030357:web:346e7fa00090604347ed1c",
  measurementId: "G-CKTT5C40BG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);
