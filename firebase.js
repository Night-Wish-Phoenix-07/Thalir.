import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Replace these values with your Firebase project configuration.

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const configured = !Object.values(firebaseConfig).some(
    value => value.startsWith("YOUR_")
);

let app = null;
let auth = null;
let db = null;
let provider = null;

if (configured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    provider = new GoogleAuthProvider();
}

export { auth, db, configured };

export async function loginWithGoogle() {
    if (!configured) {
        throw new Error("Firebase configuration is missing.");
    }

    const result = await signInWithPopup(auth, provider);
    return result.user;
}

export async function logout() {
    if (auth) {
        await signOut(auth);
    }
}

export function observeAuth(callback) {
    if (!configured) {
        callback(null);
        return () => {};
    }

    return onAuthStateChanged(auth, callback);
}

export async function saveCloudProgress(userId, progress) {
    if (!db || !userId) return;

    await setDoc(
        doc(db, "users", userId),
        {
            progress,
            updatedAt: serverTimestamp()
        },
        { merge: true }
    );
}

export async function loadCloudProgress(userId) {
    if (!db || !userId) return null;

    const snapshot = await getDoc(doc(db, "users", userId));

    return snapshot.exists()
        ? snapshot.data().progress || null
        : null;
}
