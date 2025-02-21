import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth"; //removed  getReactNativePersistence
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl44GtqZPowquFWIO-IwE1F6uEEsl2-68",
  authDomain: "tracklist-7d13f.firebase.com",
  projectId: "tracklist-7d13f",
  storageBucket: "tracklist-7d13f.firebasestorage.app",
  messagingSenderId: "631878773843",
  appId: "1:631878773843:android:166157b5ac4bc195b26aa6",
  appId: "1:631878773843:ios:7af497ae0a00c47eb26aa6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication (Expo requires AsyncStorage for persistence)
/* const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
}); */
const auth = getAuth(app);

// Initialize Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Sign up function
const signUpUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in function
const signInUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export { app, auth, db, storage, signUpUser, signInUser };