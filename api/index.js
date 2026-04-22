/**
 * @version 1.2.0
 * @changelog
 * - [16-04-2026] Inisialisasi server Express.js untuk arsitektur Monorepo.
 * - [16-04-2026] Integrasi Cloudinary Admin API untuk fetch gambar dengan aman.
 * - [16-04-2026] Integrasi Firebase Firestore SDK khusus Backend Node.js (menggunakan process.env).
 * - [16-04-2026] Pembuatan endpoint dinamis /sitemap.xml untuk optimasi SEO.
 */

import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
// Import Firebase SDK (Khusus untuk Backend Node.js)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Load environment variables dari .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- KONFIGURASI CLOUDINARY ---
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- KONFIGURASI FIREBASE (KHUSUS BACKEND) ---
// Perhatikan: Backend pakai process.env, bukan import.meta.env seperti di frontend
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};
// Inisialisasi app Firebase terpisah khusus untuk mesin server
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


// ==========================================
// ENDPOINTS
// ==========================================

// Endpoint 1: Pengecekan Status Server
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend Aktif', environment: 'Termux/Local' });
});

// Endpoint 2: Mengambil daftar gambar dari Cloudinary
app.get('/api/images', async (req, res) => {
  try {
    const { next_cursor } = req.query;
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 50,
      next_cursor: next_cursor
    });

    res.json({
      success: true,
      images: result.resources,
      next_cursor: result.next_cursor
    });
  } catch (error) {
    console.error("Cloudinary Error:", error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data dari Cloudinary' });
  }
});

// Endpoint 3: Dynamic Sitemap Generator (Mesin SEO Tahap 4)
app.get('/sitemap.xml', async (req, res) => {
  try {
    // Ganti ini dengan URL domain asli lu pas udah di-hosting (misal: https://sahalarbani.com)
    const BASE_URL = 'https://sahal-arbani-livery.vercel.app';

    // Rute statis (Halaman Legal E-E-A-T dan Home)
    const staticRoutes = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.8', changefreq: 'monthly' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
      { path: '/terms', priority: '0.5', changefreq: 'yearly' }
    ];

    // Ambil data livery dari Firestore secara langsung di backend
    const liveriesCol = collection(db, 'liveries');
    const liveriesSnapshot = await getDocs(liveriesCol);

    let dynamicRoutes = '';
    
    // Looping data database buat dibikin link XML
    liveriesSnapshot.forEach(doc => {
      const data = doc.data();
      
      // Mengambil tanggal pembaruan terakhir
      let lastModDate = new Date();
      if (data.createdAt) {
        lastModDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      }
      const lastMod = lastModDate.toISOString().split('T')[0];

      dynamicRoutes += `
    <url>
      <loc>${BASE_URL}/livery/${doc.id}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`;
    });

    // Rakit full struktur XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticRoutes.map(route => `
    <url>
      <loc>${BASE_URL}${route.path}</loc>
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>`).join('')}
    ${dynamicRoutes}
</urlset>`;

    // Paksa browser/bot buat ngebaca file ini sebagai XML
    res.header('Content-Type', 'application/xml');
    res.send(sitemap.trim());

  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    res.status(500).send('Terjadi kesalahan saat membuat sitemap.');
  }
});

// Setup Port (5000 untuk backend lokal)
const PORT = process.env.PORT || 5000;

// Trik Senior: Kita bungkus agar app.listen hanya jalan di lokal (bukan di Vercel)
// dan paksa pakai 127.0.0.1 agar Vite Proxy bisa konek tanpa error ECONNREFUSED
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`[Server] Backend Express menyala di http://127.0.0.1:${PORT}`);
  });
}

// Export app untuk kebutuhan Vercel Serverless Function ke depannya
export default app;
