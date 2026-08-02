// ============================================================
// FILE:  app.js
// ============================================================
// Firebase SDK v9 (moduli) - Authentication + Firestore (Games)
// ============================================================

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
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
const auth = getAuth(app);
const db = getFirestore(app);

// -------------------- AUTHENTICATION --------------------
export const signupUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Hitilafu signup:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Hitilafu login:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Hitilafu logout:", error);
    throw error;
  }
};

export const onAuthStateChanged = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// -------------------- Admin Check (simple) --------------------
// Tunaweza kuweka orodha ya barua pepe za admin au kuangalia custom claim.
// Hapa tunatumia orodha rahisi ya barua pepe (unaweza kubadilisha).
const ADMIN_EMAILS = [
  "admin@dvary.com",
  "dvary@admin.com",
  "manyama2006@gmail.com"  // weka barua pepe yako hapa
];

export const isAdminUser = (user) => {
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.email);
};

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
