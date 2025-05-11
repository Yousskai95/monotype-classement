import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9qjdkQ5xdjYkxLcREvrpuWOCA_WiR8yY",
  authDomain: "monotype-classement.firebaseapp.com",
  projectId: "monotype-classement",
  storageBucket: "monotype-classement.firebasestorage.app",
  messagingSenderId: "977393763286",
  appId: "1:977393763286:web:0d559b83030968336a1a77"
};

const app = initializeApp(firebaseConfig);

// 🟢 LA LIGNE QUI DOIT ÊTRE EXACTEMENT COMME ÇA :
export const db = getFirestore(app);
