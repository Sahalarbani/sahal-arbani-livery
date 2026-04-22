/**
 * @version 1.3.0
 * @changelog
 * - [16-04-2026] Performance (INP Fix): Implementasi useTransition (React 18 Concurrent Rendering) untuk menurunkan latency input & click.
 * - [16-04-2026] Penambahan state loading pada tombol submit untuk instant visual feedback.
 * - [16-04-2026] Mempertahankan UI Solid Pitch Black dan logika proteksi PIN.
 */

import React, { useState, useTransition } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, Loader2 } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Senjata pamungkas penurun skor INP (Interaction to Next Paint)
  const [isPending, startTransition] = useTransition();

  const secretPin = import.meta.env.VITE_ADMIN_PIN;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pindahkan logika berat/state update ke background task
    startTransition(() => {
      if (pinInput === secretPin) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('PIN tidak valid.');
        setPinInput('');
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-6 selection:bg-terracotta/30">
        <div className="w-full max-w-sm bg-black border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-terracotta/10 rounded-full border border-terracotta/20">
              <Lock className="w-8 h-8 text-terracotta" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Otentikasi Admin</h2>
          <p className="text-sm text-center text-white/50 mb-8">Masukkan PIN rahasia untuk melanjutkan.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (error) setError(''); // Hapus pesan error saat user mulai ngetik lagi
                }}
                placeholder="Masukkan PIN"
                disabled={isPending}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-terracotta/50 transition-colors text-center tracking-[0.5em] disabled:opacity-50"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-terracotta text-center">{error}</p>}
            <button
              type="submit"
              disabled={isPending || pinInput.length === 0}
              className="w-full bg-terracotta text-white font-medium rounded-xl px-4 py-3 hover:bg-terracotta/90 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...
                </>
              ) : (
                <>
                  Masuk Workspace <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="text-center mt-4">
              <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors">
                Batal dan kembali ke Beranda
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans selection:bg-terracotta/30 flex flex-col">
      <header className="bg-black border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-terracotta w-6 h-6" />
          <h1 className="text-lg font-bold tracking-wide">Admin Workspace</h1>
        </div>
        <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">
          Kembali ke Web
        </Link>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
