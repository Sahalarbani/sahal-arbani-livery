 /**
  * @version 1.2.0
  * @changelog
  * - [16-04-2026] Bugfix (Production): Mengganti getFirestore dengan initializeFirestore.
  * - [16-04-2026] Menambahkan opsi experimentalForceLongPolling untuk mencegah error WebChannel (transport errored) di environment Serverless/Mobile.
  */
 
 import { initializeApp } from "firebase/app";
 import { initializeFirestore } from "firebase/firestore";
 
 const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
   appId: import.meta.env.VITE_FIREBASE_APP_ID
 };
 
 const app = initializeApp(firebaseConfig);
 
 // Trik Senior: Paksa pakai Long-Polling HTTP agar koneksi database stabil di Vercel dan jaringan seluler
 export const db = initializeFirestore(app, {
   experimentalForceLongPolling: true
 });
