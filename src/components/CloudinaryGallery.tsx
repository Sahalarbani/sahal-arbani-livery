/**
 * @version 1.0.0
 * @changelog
 * - [15-04-2026] Pembuatan Custom Media Library yang terhubung ke backend Express.
 * - [15-04-2026] Implementasi on-the-fly thumbnail transformation Cloudinary (w_200, c_thumb).
 * - [15-04-2026] Fitur pagination menggunakan next_cursor.
 */

import React, { useState, useEffect } from 'react';
import { Loader2, ChevronRight, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  format: string;
}

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export const CloudinaryGallery: React.FC<Props> = ({ onSelect, onClose }) => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const fetchImages = async (cursor?: string) => {
    setLoading(true);
    try {
      const url = cursor ? `/api/images?next_cursor=${cursor}` : '/api/images';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        // Jika cursor ada, kita tambahkan ke list lama (infinite scroll feel) atau ganti (pagination)
        // Di sini kita pakai mode ganti biar HP lu gak berat render ribuan DOM
        setImages(data.images);
        setNextCursor(data.next_cursor || null);
      }
    } catch (err) {
      console.error("Gagal load gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  // Fungsi sakti buat ngubah URL asli jadi Thumbnail kenceng
  const getThumbnail = (url: string) => {
    return url.replace('/upload/', '/upload/c_thumb,w_200,g_face,f_auto/');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-[80vh] bg-charcoal border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl glass-panel">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon className="text-terracotta" /> Cloudinary Assets
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">Batal</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          {loading && images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/40">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p>Menghubungkan ke Cloudinary...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {images.map((img) => (
                <div 
                  key={img.public_id}
                  onClick={() => setSelectedUrl(img.secure_url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedUrl === img.secure_url ? 'border-terracotta scale-95 shadow-[0_0_15px_rgba(226,114,91,0.5)]' : 'border-transparent hover:border-white/20'
                  }`}
                >
                  <img 
                    src={getThumbnail(img.secure_url)} 
                    alt={img.public_id}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {selectedUrl === img.secure_url && (
                    <div className="absolute inset-0 bg-terracotta/20 flex items-center justify-center">
                      <CheckCircle2 className="text-white shadow-lg" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-white/5 flex justify-between items-center">
          <p className="text-xs text-white/30 uppercase tracking-widest">Tampil 50 Gambar</p>
          
          <div className="flex gap-4">
            {nextCursor && (
              <button 
                onClick={() => fetchImages(nextCursor)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50 text-sm font-medium"
              >
                Next 50 <ChevronRight size={16} />
              </button>
            )}
            
            <button 
              onClick={() => selectedUrl && onSelect(selectedUrl)}
              disabled={!selectedUrl}
              className="px-8 py-2 bg-terracotta text-white rounded-xl font-bold hover:bg-terracotta/90 transition-all disabled:opacity-30 shadow-lg"
            >
              Gunakan Gambar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
