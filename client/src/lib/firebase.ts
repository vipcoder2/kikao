import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-KX7FdSOLYd_po6cV07OxmVme_l49RbI",
  authDomain: "pollskika.firebaseapp.com",
  projectId: "pollskika",
  storageBucket: "pollskika.firebasestorage.app",
  messagingSenderId: "553483358469",
  appId: "1:553483358469:web:a38c477aa71473b69ea76c"
};

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

export default app;