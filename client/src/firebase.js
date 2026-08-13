import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCDvmfOEQMbCYkbMDPJ-wjNqui8fcv8gr0",
    authDomain: "expense-tracker-90d76.firebaseapp.com",
    projectId: "expense-tracker-90d76",
    storageBucket: "expense-tracker-90d76.firebasestorage.app",
    messagingSenderId: "349559547759",
    appId: "1:349559547759:web:349b8123d907088210aa9a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);