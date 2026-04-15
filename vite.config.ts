/**
 * @version 1.1.0
 * @changelog
 * - [15-04-2026] Mempertahankan konfigurasi Rollup 3 murni untuk stabilitas ARM64.
 * - [15-04-2026] Penambahan server proxy untuk merutekan traffic /api ke lokal backend Express (Port 5000).
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    proxy: {
      // Semua request React yang berawalan /api akan dilempar ke Express
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser', 
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
});
