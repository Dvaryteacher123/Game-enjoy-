// app.js - Firebase SDK v9 (moduli)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseAuthListener
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

// -------------------- Usanidi wa Firebase --------------------
const firebaseConfig = {
  apiKey: "AIzaSyDMvYgLyPNhREV6ReCosa7Ia2arDbITPmM",
  authDomain: "dvary-game.firebaseapp.com",
  projectId: "dvary-game",
  storageBucket: "dvary-game.firebasestorage.app",
  messagingSenderId: "184500970711",
  appId: "1:184500970711:web:7f9e0de296d60900c93c92",
  measurementId: "G-P6KSDKFK0S"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// -------------------- Kazi za Firestore (Bila Vizuizi vya Auth) --------------------
export const getGames = async () => {
  try {
    const gamesRef = collection(db, "games");
    // Tumeondoa orderBy ya createdAt kwa muda ili kuzuia error kama game la kwanza halina tarehe hiyo
    const snapshot = await getDocs(gamesRef);
    const games = [];
    snapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });
    return games;
  } catch (error) {
    console.error("Hitilafu getGames:", error);
    throw new Error("Imeshindwa kupata michezo.");
  }
};

export const addGame = async (gameData) => {
  try {
    const gamesRef = collection(db, "games");
    const docRef = await addDoc(gamesRef, {
      ...gameData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Hitilafu addGame:", error);
    throw new Error("Imeshindwa kuongeza mchezo: " + error.message);
  }
};

export const deleteGame = async (gameId) => {
  try {
    const gameDoc = doc(db, "games", gameId);
    await deleteDoc(gameDoc);
  } catch (error) {
    console.error("Hitilafu deleteGame:", error);
    throw new Error("Imeshindwa kufuta mchezo.");
  }
};

