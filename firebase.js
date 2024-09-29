import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { GOOGLE_API_KEY } from '@env';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOrWdLY2SdFcYwOTPF0Owwzzx-Fhka5TM",
    authDomain: "change-hub-3aa8c.firebaseapp.com",
    projectId: "change-hub-3aa8c",
    storageBucket: "change-hub-3aa8c.appspot.com",
    messagingSenderId: "736692734801",
    appId: "1:736692734801:web:02256cfea99f3269776170"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
