/**
 * @version 1.0.0
 * @changelog
 * - [15-04-2026] Pembuatan Footer publik dengan desain iOS 26 Glassmorphism.
 * - [15-04-2026] Injeksi tautan legal standar AdSense (About, Contact, Privacy, Terms).
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-white/5 bg-onyx/40 backdrop-blur-md pt-10 pb-32 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-4">Sahal Arbani <span className="text-terracotta">Livery</span></h3>
          <p className="text-sm text-white/50 leading-relaxed max-w-sm">
            Platform kurasi dan berbagi livery game kualitas tinggi dengan estetika modern. Didesain untuk memberikan pengalaman kustomisasi visual terbaik.
          </p>
        </div>
        
        <div className="flex flex-col md:items-end">
          <h4 className="text-white font-medium mb-4">Informasi & Legal</h4>
          <nav className="flex flex-col space-y-2 md:text-right">
            <Link to="/about" className="text-sm text-white/50 hover:text-terracotta transition-colors">Tentang Kami</Link>
            <Link to="/contact" className="text-sm text-white/50 hover:text-terracotta transition-colors">Kontak</Link>
            <Link to="/privacy" className="text-sm text-white/50 hover:text-terracotta transition-colors">Kebijakan Privasi</Link>
            <Link to="/terms" className="text-sm text-white/50 hover:text-terracotta transition-colors">Ketentuan Layanan</Link>
          </nav>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-white/5 text-center md:text-left">
        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} Sahal Arbani Livery. Hak cipta dilindungi undang-undang.
        </p>
      </div>
    </footer>
  );
};
