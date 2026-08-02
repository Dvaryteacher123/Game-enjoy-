// app.js - Firebase SDK v9 (moduli)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

// -------------------- Usanidi wa Firebase (Mpya) --------------------
const firebaseConfig = {
  apiKey: "AIzaSyAHNhUyFC7PlZGijkmYUnEc1GlEYJGHI40",
  authDomain: "manyama2006-50664.firebaseapp.com",
  projectId: "manyama2006-50664",
  storageBucket: "manyama2006-50664.firebasestorage.app",
  messagingSenderId: "749612577601",
  appId: "1:749612577601:web:53295431132ddff30027c0",
  measurementId: "G-9E858GX9HB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// -------------------- Kazi za Firestore (Games) --------------------
export const getGames = async () => {
  try {
    const gamesRef = collection(db, "games");
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

