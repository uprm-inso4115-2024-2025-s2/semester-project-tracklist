// constants/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCl44GtqZPowquFWIO-IwE1F6uEEsl2-68",
  authDomain: "tracklist-7d13f.firebase.com",
  projectId: "tracklist-7d13f",
  storageBucket: "tracklist-7d13f.firebasestorage.app",
  messagingSenderId: "631878773843",
  appId: "1:631878773843:android:166157b5ac4bc195b26aa6",
  appID: "1:631878773843:ios:7af497ae0a00c47eb26aa6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore & Storage if needed
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };


