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

// -------------------- Constants --------------------
const ADMIN_EMAIL = "Dullamanyama0@gmail.com";

// -------------------- Kazi za Auth --------------------
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signupUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const onAuthStateChanged = (callback) => {
  return firebaseAuthListener(auth, callback);
};

export const isAdminUser = (user) => {
  if (!user) return false;
  return user.email === ADMIN_EMAIL;
};

// -------------------- Kazi za Firestore --------------------
export const getGames = async () => {
  try {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
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
  const user = auth.currentUser;
  if (!user) throw new Error("Hujaingia. Tafadhali ingia kama admin.");
  if (!isAdminUser(user)) throw new Error("Huna ruhusa ya kuongeza michezo.");

  try {
    const gamesRef = collection(db, "games");
    const docRef = await addDoc(gamesRef, {
      ...gameData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Hitilafu addGame:", error);
    throw new Error("Imeshindwa kuongeza mchezo.");
  }
};

export const deleteGame = async (gameId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Hujaingia. Tafadhali ingia kama admin.");
  if (!isAdminUser(user)) throw new Error("Huna ruhusa ya kufuta michezo.");

  try {
    const gameDoc = doc(db, "games", gameId);
    await deleteDoc(gameDoc);
  } catch (error) {
    console.error("Hitilafu deleteGame:", error);
    throw new Error("Imeshindwa kufuta mchezo.");
  }
};

