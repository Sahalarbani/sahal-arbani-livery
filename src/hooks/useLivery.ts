/**
 * @version 2.0.0
 * @changelog
 * - [15-04-2026] Restrukturisasi interface Livery untuk mengakomodasi skema data kompleks (Kategori, Detail, Tags).
 * - [15-04-2026] Penambahan default value downloadCount untuk Fase 4.
 */

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

// Skema Database Baru yang Jauh Lebih Detail
export interface LiveryDescription {
  truck: string;
  company: string;
  game: string;
  greeting: string;
}

export interface Livery {
  id: string;
  title: string;
  category: string;
  description: LiveryDescription;
  credits: string;
  tags: string[];
  uploaderName: string;
  previewImages: string[];
  downloadImages: string[];
  downloadCount: number;
  createdAt: number;
}

export const useLivery = () => {
  const [liveries, setLiveries] = useState<Livery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "liveries"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Livery[];
        
        setLiveries(data);
        setIsLoading(false);
      },
      (err) => {
        console.error("Firebase Snapshot Error:", err.message);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { liveries, isLoading, error };
};
