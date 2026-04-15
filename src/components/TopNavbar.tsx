/**
 * @version 1.3.0
 * @changelog
 * - [16-04-2026] SEO/A11y (Tahap 2): Menambahkan aria-labels dan role tags untuk Screen Readers & AI Bots.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Compass, ShieldAlert, Info, ChevronRight } from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Beranda', path: '/', icon: <Home size={20} aria-hidden="true" /> },
    { name: 'Tentang', path: '/about', icon: <Info size={20} aria-hidden="true" /> },
    { name: 'Admin', path: '/admin', icon: <ShieldAlert size={20} aria-hidden="true" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-4" role="navigation" aria-label="Navigasi Utama">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-black border border-white/10 rounded-2xl px-5 py-3 shadow-2xl">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)} aria-label="Kembali ke Beranda Sahal Arbani Livery">
          <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(226,114,91,0.4)]" aria-hidden="true">
            <span className="text-white font-bold text-sm">SA</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Sahal <span className="text-terracotta">Arbani</span>
          </span>
        </Link>

        {/* Aria-Label & Aria-Expanded biar Google ngerti ini tombol menu dropdown */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={isOpen}
          className="p-2 hover:bg-[#111] rounded-xl transition-colors text-white"
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-24 left-6 right-6 bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-50 p-4"
            role="menu"
          >
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#0A0A0A] active:bg-[#111] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-terracotta/80 group-hover:text-terracotta transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-medium text-white/90 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover:text-terracotta transition-colors" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold">
                &copy; {new Date().getFullYear()} Sahal Arbani Livery
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 -z-10 h-screen w-screen"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </nav>
  );
};
