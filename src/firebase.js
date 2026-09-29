import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCw5er8Om8I7xXcIGSTkID564IMaNSLovo",
  authDomain: "tic-tac-toe-35c4e.firebaseapp.com",
  projectId: "tic-tac-toe-35c4e",
  storageBucket: "tic-tac-toe-35c4e.firebasestorage.app",
  messagingSenderId: "959611721914",
  appId: "1:959611721914:web:bbbe4bbd518127f1638a83",
  measurementId: "G-1PWGT1GG2W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Firestore
export const db = getFirestore(app);

/**
 * Helper to produce user-friendly Firestore error messages
 */
function handleFirestoreError(err) {
  const msg = err.message || "";
  const code = err.code || "";

  if (
    msg.includes("Missing or insufficient permissions") ||
    code === "permission-denied"
  ) {
    return new Error(
      "Permission Denied: Please go to the 'Rules' tab in your Firestore Console (right next to 'Data'), change the rule to 'allow read, write: if true;' and click 'Publish'."
    );
  }

  if (msg.includes("not been used in project") || msg.includes("disabled")) {
    return new Error(
      "Firestore is not enabled yet in your project. Please click 'Create database' under Build > Firestore Database."
    );
  }

  return err;
}

/**
 * Generate a random 6-character room code
 */
export function generateSessionId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a new multiplayer session in Firestore
 */
export async function createSession(sessionId) {
  const sessionRef = doc(db, "sessions", sessionId);
  const initialData = {
    board: ["", "", "", "", "", "", "", "", ""],
    isX: true,
    isPlaying: true,
    scores: { x: 0, o: 0, ties: 0 },
    round: 1,
    scoredRound: 0,
    hostJoined: true,
    clientJoined: false,
    status: "waiting", // 'waiting' | 'playing' | 'abandoned'
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  };

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            "Firestore request timed out. Please check your internet connection or Firestore Rules."
          )
        ),
      10000
    )
  );

  try {
    await Promise.race([setDoc(sessionRef, initialData), timeoutPromise]);
    return initialData;
  } catch (err) {
    throw handleFirestoreError(err);
  }
}

/**
 * Join an existing session
 */
export async function joinSession(sessionId) {
  const sessionRef = doc(db, "sessions", sessionId);
  let snap;
  try {
    snap = await getDoc(sessionRef);
  } catch (err) {
    throw handleFirestoreError(err);
  }

  if (!snap.exists()) {
    throw new Error("Session code not found. Please check the code.");
  }

  const data = snap.data();
  if (data.clientJoined && data.status === "playing") {
    throw new Error("This room is already full.");
  }

  try {
    await updateDoc(sessionRef, {
      clientJoined: true,
      status: "playing",
      lastUpdated: serverTimestamp(),
    });
  } catch (err) {
    throw handleFirestoreError(err);
  }

  return data;
}

/**
 * Subscribe to real-time session changes
 */
export function subscribeSession(sessionId, onUpdate, onError) {
  const sessionRef = doc(db, "sessions", sessionId);
  return onSnapshot(
    sessionRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data());
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error("Firestore subscription error:", error);
      if (onError) onError(handleFirestoreError(error));
    }
  );
}

/**
 * Update the board move in Firestore
 */
export async function updateMove(sessionId, newBoard, nextIsX) {
  const sessionRef = doc(db, "sessions", sessionId);
  try {
    await updateDoc(sessionRef, {
      board: newBoard,
      isX: nextIsX,
      lastUpdated: serverTimestamp(),
    });
  } catch (err) {
    throw handleFirestoreError(err);
  }
}

/**
 * Update scores and mark the round scored
 */
export async function updateScores(sessionId, newScores, round) {
  const sessionRef = doc(db, "sessions", sessionId);
  try {
    await updateDoc(sessionRef, {
      scores: newScores,
      scoredRound: round,
      lastUpdated: serverTimestamp(),
    });
  } catch (err) {
    throw handleFirestoreError(err);
  }
}

/**
 * Restart the game for the next round
 */
export async function restartGame(sessionId, nextRound) {
  const sessionRef = doc(db, "sessions", sessionId);
  try {
    await updateDoc(sessionRef, {
      board: ["", "", "", "", "", "", "", "", ""],
      isX: true,
      round: nextRound,
      lastUpdated: serverTimestamp(),
    });
  } catch (err) {
    throw handleFirestoreError(err);
  }
}

/**
 * Reset scores to 0
 */
export async function resetSessionScores(sessionId) {
  const sessionRef = doc(db, "sessions", sessionId);
  try {
    await updateDoc(sessionRef, {
      scores: { x: 0, o: 0, ties: 0 },
      lastUpdated: serverTimestamp(),
    });
  } catch (err) {
    throw handleFirestoreError(err);
  }
}

/**
 * Leave or delete a session
 */
export async function leaveSession(sessionId) {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    await deleteDoc(sessionRef);
  } catch (err) {
    console.error("Error leaving session:", err);
  }
}
