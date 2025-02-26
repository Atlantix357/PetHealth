import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Helper function to handle Google Sign-In
const handleGoogleSignIn = async (idToken) => {
  try {
    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);
    
    // Sign in with the credential
    const userCredential = await signInWithCredential(auth, googleCredential);
    
    // Save user info to AsyncStorage for offline access
    await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
    
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Check if user is already signed in
const checkUserAuth = async () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export { 
  app, 
  auth, 
  db, 
  storage, 
  googleProvider, 
  handleGoogleSignIn,
  checkUserAuth
};
