/**
 * @version 1.1.0
 * @changelog
 * - [15-04-2026] Refaktor ikon navigasi menggunakan komponen Link dari React Router Dom.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, PlusCircle, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm rounded-full bg-charcoal/60 backdrop-blur-xl border border-white/10 flex justify-between items-center px-6 py-3 z-50 shadow-2xl">
      <Link to="/">
        <Home className="text-white cursor-pointer w-6 h-6 hover:scale-110 transition-transform" />
      </Link>
      <Link to="/about">
        <Compass className="text-white/50 hover:text-white transition-colors cursor-pointer w-6 h-6" />
      </Link>
      <Link to="/admin">
        <PlusCircle className="text-terracotta cursor-pointer w-8 h-8 drop-shadow-[0_0_8px_rgba(226,114,91,0.5)] hover:scale-110 transition-transform" />
      </Link>
      <User className="text-white/50 hover:text-white transition-colors cursor-pointer w-6 h-6" />
    </div>
  );
};
