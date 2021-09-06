import firebase from "firebase";
import "firebase/auth"
import "firebase/storage"
import "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyDuYFObAKYh6nWNWOvsn3xSoRT-HOIisyw",
    authDomain: "slack-clone-o.firebaseapp.com",
    databaseURL: "https://slack-clone-o-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "slack-clone-o",
    storageBucket: "slack-clone-o.appspot.com",
    messagingSenderId: "54743205855",
    appId: "1:54743205855:web:6d2dcf257365c9000ba66a"
};
// Initialize Firebase
export const firebaseApp=firebase.initializeApp(firebaseConfig);
export const FirebaseAuth=firebase.auth(firebaseApp)
export default firebase