/**
 * @version 1.2.0
 * @changelog
 * - [15-04-2026] Migrasi dari Bottom Navbar ke Top Navbar dengan Dropdown.
 * - [15-04-2026] Penyesuaian padding top untuk menghindari tumpang tindih konten.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from '../components/TopNavbar';
import { Footer } from '../components/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-onyx text-white font-sans selection:bg-terracotta/30 flex flex-col">
      {/* Navbar Baru di Atas */}
      <TopNavbar />

      {/* Jarak pt-28 disesuaikan agar konten mulai di bawah navbar melayang */}
      <main className="px-6 pt-28 flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
