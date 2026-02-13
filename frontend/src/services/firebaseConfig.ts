import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyApRAi2D7RrGadwSSk_bh9QBbW6eTPawS8",
    authDomain: "bingo2gether-f2631.firebaseapp.com",
    projectId: "bingo2gether-f2631",
    storageBucket: "bingo2gether-f2631.firebasestorage.app",
    messagingSenderId: "227802289191",
    appId: "1:227802289191:web:ae13d4720072e463cfea02",
    measurementId: "G-84P3Y8FDFL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
