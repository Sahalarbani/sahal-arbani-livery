/**
 * @version 1.4.0
 * @changelog
 * - [15-04-2026] Pendaftaran Dynamic Route (/livery/:id) untuk memuat komponen LiveryDetail.
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact, Privacy, Terms } from './pages/Legal';
import { Admin } from './pages/Admin';
import { LiveryDetail } from './pages/LiveryDetail'; // Import Halaman Detail Baru

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            {/* Dynamic Route Fase 3 */}
            <Route path="/livery/:id" element={<LiveryDetail />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
