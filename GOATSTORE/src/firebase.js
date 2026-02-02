import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// 1. On importe getAuth pour gérer les connexions clients
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuNvNcUT4oDCwTk9UsMq2eRFC6rpL7mig",
  authDomain: "jeune-riche-app.firebaseapp.com",
  projectId: "jeune-riche-app",
  storageBucket: "jeune-riche-app.firebasestorage.app",
  messagingSenderId: "40639360294",
  appId: "1:40639360294:web:fdd9542e8e09e56073a5e7",
  measurementId: "G-EX6FY1PTC1"
};

// 2. Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 3. ON EXPORTE LES SERVICES
// La base de données Firestore
export const db = getFirestore(app);
// Le service d'authentification (C'est ce qui corrige ton erreur !)
export const auth = getAuth(app);