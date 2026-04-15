/**
 * @version 2.3.0
 * @changelog
 * - [16-04-2026] SEO/A11y (Tahap 2): Menambahkan Dynamic Alt Text untuk gambar agar mudah dibaca AI Crawler.
 * - [16-04-2026] Menambahkan aria-label pada navigasi Link untuk lolos audit Google Lighthouse.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Livery } from '../hooks/useLivery';

export const LiverySkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[340px] rounded-3xl bg-black border border-white/10 overflow-hidden shadow-xl animate-pulse" aria-hidden="true">
      <div className="w-full h-48 bg-white/5" />
      <div className="p-5 space-y-4">
        <div className="w-3/4 h-5 bg-white/10 rounded-lg" />
        <div className="space-y-2">
          <div className="w-full h-3 bg-white/5 rounded" />
          <div className="w-5/6 h-3 bg-white/5 rounded" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-4">
          <div className="w-16 h-4 bg-white/5 rounded" />
          <div className="w-24 h-8 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const LiveryCard: React.FC<{ data: Livery }> = ({ data }) => {
  const rawImageUrl = data.previewImages?.[0] || (data as any).imageUrl || '';
  const optimizedImageUrl = rawImageUrl.replace('/upload/', '/upload/c_thumb,w_500,g_face,q_auto,f_auto/');

  const technicalSpecs = [
    data.description?.truck && `Truck: ${data.description.truck}`,
    data.description?.game && `Game: ${data.description.game}`,
    data.description?.company && `Company: ${data.description.company}`
  ].filter(Boolean).join(' • ');

  // Sinyal AI: Bikin teks Alt sangat deskriptif untuk SGE (Search Generative Experience)
  const aiAltText = `Preview mod livery ${data.title} kategori ${data.category || 'umum'} untuk game ${data.description?.game || 'Simulator'}`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full rounded-3xl bg-black border border-white/10 overflow-hidden shadow-2xl group flex flex-col h-[340px] hover:border-terracotta/50 transition-colors"
      role="article" // Kasih tau Google ini adalah blok konten mandiri
    >
      <div className="relative h-48 w-full overflow-hidden bg-[#0A0A0A] shrink-0">
        <img 
          src={optimizedImageUrl} 
          alt={aiAltText} // Injeksi Alt Text SEO
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute top-4 left-4 bg-black border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Tag size={12} className="text-terracotta" aria-hidden="true" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{data.category || 'Livery'}</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between z-10 relative bg-black">
        <div>
          <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-terracotta transition-colors">
            {data.title}
          </h3>
          
          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
            {technicalSpecs || 'Spesifikasi detail tidak tersedia. Silakan cek halaman artikel untuk informasi lebih lanjut.'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-white/40" title={`${data.downloadCount || 0} Total Unduhan`}>
            <Download size={14} className="text-terracotta/70" aria-hidden="true" />
            <span className="text-xs font-medium">{data.downloadCount || 0} Kali</span>
          </div>
          
          <Link 
            to={`/livery/${data.id}`}
            aria-label={`Lihat detail dan spesifikasi lengkap untuk ${data.title}`} // Injeksi Aria-Label untuk screen reader/bot
            className="flex items-center gap-1 bg-[#111] hover:bg-terracotta/10 text-terracotta px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-white/5 hover:border-terracotta/30"
          >
            Detail <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
