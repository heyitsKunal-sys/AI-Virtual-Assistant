import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chatplug-60e41.firebaseapp.com",
  projectId: "chatplug-60e41",
  storageBucket: "chatplug-60e41.firebasestorage.app",
  messagingSenderId: "560846017594",
  appId: "1:560846017594:web:e16f7cad24f3adb16c5103",
  measurementId: "G-WSWV09GB62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }

