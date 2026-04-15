/**
 * @version 2.0.3
 * @changelog
 * - [15-04-2026] UI Tweak: Mengurangi padding-top (pt-24) agar jarak Hero Section dengan TopNavbar tidak terlalu jauh.
 * - [15-04-2026] UI Tweak: Menghilangkan border-left pada deskripsi Hero agar teks benar-benar bebas (tidak terlihat seperti di dalam card).
 */

import React, { useState, useMemo } from 'react';
import { Search, Terminal } from 'lucide-react';
import { useLivery } from '../hooks/useLivery';
import { LiveryCard, LiverySkeleton } from '../components/LiveryCard';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
  const { liveries, isLoading } = useLivery();
  
  // State untuk Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Mengekstrak kategori unik dari database secara otomatis
  const categories = useMemo(() => {
    if (!liveries) return ['Semua'];
    const uniqueCategories = new Set(liveries.map(item => item.category || 'Uncategorized'));
    return ['Semua', ...Array.from(uniqueCategories)];
  }, [liveries]);

  // Logika Filter Ganda (Berdasarkan Search & Kategori)
  const filteredLiveries = useMemo(() => {
    return liveries.filter(livery => {
      const matchCategory = activeCategory === 'Semua' || livery.category === activeCategory;
      const matchSearch = livery.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          livery.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          livery.description?.truck.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [liveries, searchQuery, activeCategory]);

  return (
    // Jarak atas dikurangi jadi pt-24 biar lebih rapet ke navbar
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-24 pb-20 px-6">
      <SEO title="Sahal Arbani Livery | High Quality Assets" description="Platform kurasi dan berbagi livery game kualitas tinggi dengan estetika modern." />
      
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- HERO SECTION --- */}
        <section className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
            Sahal Arbani <span className="text-terracotta">Livery</span>
          </h1>
          {/* Teks dibikin polos tanpa border kiri (pure plain text) */}
          <p className="text-white/60 text-lg leading-relaxed font-light">
            Platform kurasi dan berbagi livery game kualitas tinggi dengan estetika modern. Didesain untuk memberikan pengalaman kustomisasi visual terbaik.
          </p>
        </section>

        {/* --- SEARCH & FILTER SECTION --- */}
        <section className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-white/40" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari livery, truck, atau tag..."
              className="w-full bg-transparent border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-terracotta/80 transition-colors"
            />
          </div>

          {/* Dynamic Categories Scrollable Container */}
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-6 px-6 md:mx-0 md:px-0">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === category 
                    ? 'bg-terracotta text-white border-terracotta shadow-[0_0_15px_rgba(226,114,91,0.4)]' 
                    : 'bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* --- GRID KONTEN --- */}
        <section>
          {/* Header Info Total Aset */}
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Terminal className="text-terracotta" size={18} /> Direktori Aset
            </h2>
            <span className="text-xs font-medium text-white/40 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
              {filteredLiveries.length} Hasil
            </span>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => <LiverySkeleton key={idx} />)
            ) : filteredLiveries.length > 0 ? (
              filteredLiveries.map((livery) => (
                <LiveryCard key={livery.id} data={livery} />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <Search size={48} className="text-white/20 mb-4" />
                <h3 className="text-xl font-bold text-white/80 mb-2">Tidak ditemukan</h3>
                <p className="text-white/40 text-sm">Livery dengan kata kunci atau kategori tersebut belum tersedia.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('Semua'); }}
                  className="mt-6 px-6 py-2 bg-transparent hover:bg-white/5 border border-white/20 rounded-xl text-sm transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
