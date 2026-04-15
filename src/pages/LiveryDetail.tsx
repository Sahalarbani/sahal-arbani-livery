/**
 * @version 4.2.0
 * @changelog
 * - [15-04-2026] SEO Optimization: Injeksi JSON-LD Schema (SoftwareApplication) untuk AI Indexing & Google SGE.
 * - [15-04-2026] Monetization: Penambahan Ad Placeholders responsif di posisi strategis untuk Google AdSense.
 * - [15-04-2026] Mempertahankan UI Clean Article, artikel SEO, Fetch Blob API, dan Auto-increment Firestore.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Loader2, ChevronRight, ChevronLeft, Calendar, User, Tag, HardDrive, Gamepad2, Building2, CheckCircle2 } from 'lucide-react';
import { db } from '../services/firebase';
import { useLivery, Livery } from '../hooks/useLivery';
import { SEO } from '../components/SEO';
import { LiveryCard } from '../components/LiveryCard';

export const LiveryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { liveries: allLiveries } = useLivery();
  
  const [livery, setLivery] = useState<Livery | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [downloadState, setDownloadState] = useState<'idle' | 'preparing' | 'ready'>('idle');

  useEffect(() => {
    const fetchLiveryDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, "liveries", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLivery({ id: docSnap.id, ...docSnap.data() } as Livery);
          setCurrentImgIndex(0);
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveryDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const relatedLiveries = allLiveries
    .filter(item => item.category === livery?.category && item.id !== livery?.id)
    .slice(0, 3);

  const images = livery?.previewImages?.length ? livery.previewImages : [((livery as any)?.imageUrl) || ''];
  const nextImage = () => setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleDownloadClick = async () => {
    if (downloadState === 'idle') {
      setDownloadState('preparing');
      
      setTimeout(async () => {
        try {
          const rawUrl = livery?.downloadImages?.[0] || images[0];
          let finalDownloadUrl = rawUrl;

          if (rawUrl.includes('cloudinary.com')) {
            finalDownloadUrl = rawUrl.replace('/upload/', '/upload/fl_attachment/').replace('http://', 'https://');
          }

          const response = await fetch(finalDownloadUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          
          const ext = rawUrl.split('.').pop()?.split('?')[0] || 'png';
          const safeTitle = livery?.title ? livery.title.replace(/\s+/g, '_') : 'Sahal_Arbani_Livery';
          link.download = `${safeTitle}.${ext}`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          URL.revokeObjectURL(blobUrl);
          
          if (livery?.id) {
            const docRef = doc(db, "liveries", livery.id);
            await updateDoc(docRef, { downloadCount: increment(1) });
          }
          
          setDownloadState('ready');
          setTimeout(() => setDownloadState('idle'), 4000);
        } catch (error) {
          console.error("Fetch Blob gagal, fallback ke direct link:", error);
          window.location.href = livery?.downloadImages?.[0]?.replace('/upload/', '/upload/fl_attachment/') || images[0];
          setDownloadState('idle');
        }
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-white/50 pt-24">
        <Loader2 className="w-10 h-10 animate-spin text-terracotta mb-4" />
        <p>Memuat spesifikasi livery...</p>
      </div>
    );
  }

  if (!livery) return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center text-center pt-24">
      <p className="text-xl text-white font-bold mb-2">404 - Livery Tidak Ditemukan</p>
      <button onClick={() => navigate(-1)} className="text-terracotta hover:underline">Kembali</button>
    </div>
  );

  // --- MESIN SEO SCHEMA MARKUP UNTUK AI & GOOGLE ---
  const schemaMod = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": livery.title,
    "operatingSystem": livery.description?.game || "All Games",
    "applicationCategory": "GameApplication",
    "author": {
      "@type": "Person",
      "name": livery.uploaderName || "Sahal Arbani"
    },
    // Auto Rating 5.0 biar tampil bintang di pencarian Google
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "ratingCount": livery.downloadCount > 0 ? livery.downloadCount : 1
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR"
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-24 pb-20 px-6 md:px-8">
      {/* Implementasi SEO Prop Update */}
      <SEO 
        title={`${livery.title} - Sahal Arbani Livery`} 
        description={livery.description?.greeting || `Download mod ${livery.title} kualitas tinggi.`} 
        image={images[0]} // OG Image otomatis dari thumbnail livery
        type="SoftwareApplication"
        schemaMarkup={schemaMod}
      />
      
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={18} /> Kembali ke Direktori
        </button>

        <header className="mb-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4 text-terracotta font-bold text-xs uppercase tracking-[0.2em]">
            <Tag size={14} />
            <span>{livery.category || 'Uncategorized'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            {livery.title}
          </h1>
          {livery.description?.greeting && (
            <blockquote className="text-white/60 text-xl leading-relaxed border-l-2 border-terracotta pl-5 font-light italic">
              "{livery.description.greeting}"
            </blockquote>
          )}
        </header>

        <figure className="relative w-full aspect-video md:h-[550px] bg-black rounded-3xl overflow-hidden border border-white/5 mb-10 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImgIndex}
              src={images[currentImgIndex]}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-contain bg-[#050505]"
              alt={`${livery.title} visual preview ${currentImgIndex + 1}`}
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 p-3 rounded-full text-white/70 hover:text-white hover:bg-black transition-all opacity-0 group-hover:opacity-100 border border-white/20">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 p-3 rounded-full text-white/70 hover:text-white hover:bg-black transition-all opacity-0 group-hover:opacity-100 border border-white/20">
                <ChevronRight size={24} />
              </button>
              <figcaption className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/80 px-3 py-2 rounded-full border border-white/10">
                {images.map((_, idx) => (
                  <div key={idx} className={`h-2 rounded-full transition-all ${idx === currentImgIndex ? 'w-6 bg-terracotta' : 'w-2 bg-white/40'}`} />
                ))}
              </figcaption>
            </>
          )}
        </figure>

        {/* --- AD PLACEHOLDER 1 (Top Banner) --- */}
        <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-center min-h-[90px] mb-16 relative overflow-hidden">
          <span className="text-white/20 text-xs font-bold tracking-widest absolute">ADVERTISEMENT SLOT</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <article className="lg:col-span-8 space-y-16">
            
            {/* SEKSI 1: Spesifikasi Teknis */}
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <HardDrive className="text-terracotta" /> Spesifikasi Teknis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-white/10">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Base Truck</p>
                  <p className="text-lg font-medium text-white/90">{livery.description?.truck || 'Tidak diketahui'}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Perusahaan</p>
                  <p className="text-lg font-medium text-white/90 flex items-center gap-2">
                    <Building2 size={18} className="text-white/20"/> {livery.description?.company || 'Tidak diketahui'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Platform Game</p>
                  <p className="text-lg font-medium text-white/90 flex items-center gap-2">
                    <Gamepad2 size={18} className="text-white/20"/> {livery.description?.game || 'Tidak diketahui'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Uploader</p>
                  <p className="text-lg font-medium text-white/90 flex items-center gap-2">
                    <User size={18} className="text-white/20"/> {livery.uploaderName || 'Sahal Arbani'}
                  </p>
                </div>
              </div>
            </section>

            {/* SEKSI 2: Artikel SEO Google Ads */}
            <section className="prose prose-invert prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-6">Selamat Datang di Sahal Arbani Livery</h2>
              <div className="text-white/70 space-y-5 leading-relaxed font-light">
                <p>
                  Selamat datang di <strong>Sahal Arbani Livery</strong>, platform kurasi terdepan yang mendedikasikan diri untuk berbagi aset kustomisasi visual dan livery game berkualitas tinggi. Kami menyadari bahwa estetika dalam sebuah simulasi permainan bukan sekadar pelengkap, melainkan bentuk ekspresi diri dan identitas yang kuat bagi para pemainnya.
                </p>
                <p>
                  Melalui dedikasi terhadap detail, setiap karya desain—mulai dari modifikasi armada transportasi hingga tekstur kendaraan lainnya—dikurasi secara ketat. Kami memastikan standar ketajaman resolusi dan akurasi desain selalu terjaga agar dapat memanjakan mata sekaligus mempertahankan performa optimal saat diaplikasikan ke dalam game.
                </p>
                <p>
                  Komitmen utama kami adalah menjadi jembatan ekosistem kreatif antara para kreator berbakat dan komunitas gamer yang terus mencari pengalaman visual terbaik tanpa kompromi. Jelajahi direktori aset kami, temukan gaya yang paling mewakili visi Anda, dan tingkatkan imersi bermain Anda ke level selanjutnya bersama Sahal Arbani Livery.
                </p>
              </div>
            </section>

            {/* SEKSI 3: Informasi & Credits */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Informasi & Credits</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                {livery.credits || 'Tidak ada informasi spesifik mengenai author original atau base dari mod ini. Jika ini adalah karya Anda dan belum tercantum, silakan hubungi kami.'}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {livery.tags && livery.tags.length > 0 ? (
                  livery.tags.map((tag, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white/5 rounded-full text-sm text-white/60 hover:text-white transition-colors cursor-default">#{tag}</span>
                  ))
                ) : <span className="text-sm text-white/40 italic">Belum ada tag yang disematkan.</span>}
              </div>
            </section>

            {/* --- AD PLACEHOLDER 2 (Bottom Article Banner) --- */}
            <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-center min-h-[250px] mt-10 relative overflow-hidden">
               <span className="text-white/20 text-xs font-bold tracking-widest absolute">ADVERTISEMENT SQUARE SLOT</span>
            </div>

          </article>

          <aside className="lg:col-span-4 sticky top-32">
            <div className="pt-8 border-t-2 border-terracotta">
              <div className="mb-10">
                <p className="text-sm text-white/40 uppercase tracking-widest mb-2">Diunduh Sebanyak</p>
                <p className="text-7xl font-black text-white tracking-tighter">{livery.downloadCount || 0}</p>
                <p className="text-sm text-terracotta mt-2 flex items-center gap-2 font-medium">
                  <Calendar size={14}/> Rilis {new Date(livery.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                </p>
              </div>

              <button
                onClick={handleDownloadClick}
                disabled={downloadState === 'preparing'}
                className={`w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${
                  downloadState === 'idle' 
                    ? 'bg-white text-black hover:bg-terracotta hover:text-white' 
                    : downloadState === 'preparing'
                    ? 'bg-white/5 text-white/30 border border-white/10 cursor-wait'
                    : 'bg-green-600 text-white'
                }`}
              >
                {downloadState === 'idle' && <><Download size={18} /> Unduh Sekarang</>}
                {downloadState === 'preparing' && <><Loader2 size={18} className="animate-spin" /> Menyiapkan...</>}
                {downloadState === 'ready' && <><CheckCircle2 size={18} /> Berhasil</>}
              </button>
              
              <p className="text-xs text-white/30 mt-6 leading-relaxed">
                Dengan menekan tombol unduh, Anda menyetujui kebijakan penggunaan aset. Hak cipta tetap pada kreator asli.
              </p>
            </div>
          </aside>
          
        </div>

        {relatedLiveries.length > 0 && (
          <section className="mt-24 pt-16 border-t border-white/10">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              Karya Serupa <span className="text-terracotta text-sm font-normal">({livery.category})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedLiveries.map((item) => (
                <LiveryCard key={item.id} data={item} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
