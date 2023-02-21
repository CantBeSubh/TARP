import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAKNZHjwAiqmZlT22Lnau_dEYBmIloAr4E",
    authDomain: "tarp-13426.firebaseapp.com",
    projectId: "tarp-13426",
    storageBucket: "tarp-13426.appspot.com",
    messagingSenderId: "688436115557",
    appId: "1:688436115557:web:0c51931e14ed78c1b4ee8c",
    measurementId: "G-9LYDEGB5P7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

export { auth };