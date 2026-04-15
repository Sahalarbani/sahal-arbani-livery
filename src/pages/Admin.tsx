/**
 * @version 2.1.0
 * @changelog
 * - [15-04-2026] Migrasi sistem Preset ke Firebase Firestore (mendukung multiple presets).
 * - [15-04-2026] Pembuatan UI Preset Chips (Tap to Load, Tap to Delete) di atas form.
 * - [15-04-2026] Integrasi komponen CloudinaryGallery untuk memilih gambar langsung dari backend.
 */

import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { UploadCloud, Trash2, Save, Link as LinkIcon, ImagePlus, Loader2, X, Bookmark } from 'lucide-react';
import { db } from '../services/firebase';
import { uploadToCloudinary } from '../services/cloudinary';
import { useLivery, LiveryDescription } from '../hooks/useLivery';
import { SEO } from '../components/SEO';
import { CloudinaryGallery } from '../components/CloudinaryGallery'; // Pastikan path ini benar

// Interface untuk Preset Firebase
interface PresetData {
  id: string;
  category: string;
  desc: LiveryDescription;
  credits: string;
  tagsInput: string;
}

export const Admin: React.FC = () => {
  const { liveries, isLoading } = useLivery();
  
  // State Form Kompleks
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [uploaderName, setUploaderName] = useState('Sahal Arbani');
  const [desc, setDesc] = useState<LiveryDescription>({ truck: '', company: '', game: '', greeting: '' });
  const [credits, setCredits] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // State Gambar
  const [previewInput, setPreviewInput] = useState('');
  const [downloadInput, setDownloadInput] = useState('');
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  
  // State UI
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [showGallery, setShowGallery] = useState<'preview' | 'download' | null>(null);
  
  // State Presets
  const [presets, setPresets] = useState<PresetData[]>([]);

  // --- FETCH PRESETS DARI FIREBASE ---
  useEffect(() => {
    const q = query(collection(db, "admin_presets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PresetData[];
      setPresets(data);
    });
    return () => unsubscribe();
  }, []);

  // --- LOGIKA MULTI-PRESET ---
  const savePresetToFirebase = async () => {
    if (!category && !desc.truck && !tagsInput) {
      setStatusMsg({ type: 'error', text: 'Isi setidaknya Kategori, Truck, atau Tags untuk dijadikan preset!' });
      setTimeout(() => setStatusMsg(null), 3000);
      return;
    }
    try {
      await addDoc(collection(db, "admin_presets"), {
        category,
        desc,
        credits,
        tagsInput,
        createdAt: Date.now()
      });
      setStatusMsg({ type: 'success', text: 'Preset baru berhasil disimpan ke database!' });
    } catch (error: any) {
      setStatusMsg({ type: 'error', text: `Gagal simpan preset: ${error.message}` });
    }
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const applyPreset = (preset: PresetData) => {
    setCategory(preset.category || '');
    setDesc(preset.desc || { truck: '', company: '', game: '', greeting: '' });
    setCredits(preset.credits || '');
    setTagsInput(preset.tagsInput || '');
    setStatusMsg({ type: 'success', text: `Preset [${preset.category || preset.desc.truck}] diterapkan!` });
    setTimeout(() => setStatusMsg(null), 2000);
  };

  const deletePreset = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Biar pas klik hapus, presetnya gak ikut ke-apply
    if (window.confirm("Hapus preset ini dari database?")) {
      await deleteDoc(doc(db, "admin_presets", id));
    }
  };

  // --- LOGIKA GALLERY CLOUDINARY ---
  const handleSelectFromCloudinary = (url: string) => {
    if (showGallery === 'preview') setPreviewInput(url);
    if (showGallery === 'download') setDownloadInput(url);
    setShowGallery(null);
  };

  // --- LOGIKA UPLOAD & SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setStatusMsg({ type: 'error', text: 'Judul wajib diisi!' });
      return;
    }

    setIsUploading(true);
    setStatusMsg(null);

    try {
      let finalPreviewUrl = previewInput;
      if (previewFile) {
        finalPreviewUrl = await uploadToCloudinary(previewFile);
      }

      let finalDownloadUrl = downloadInput;
      if (downloadFile) {
        finalDownloadUrl = await uploadToCloudinary(downloadFile);
      }

      const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

      await addDoc(collection(db, "liveries"), {
        title,
        category: category || 'Uncategorized',
        description: desc,
        credits,
        tags: tagsArray,
        uploaderName,
        previewImages: finalPreviewUrl ? [finalPreviewUrl] : [],
        downloadImages: finalDownloadUrl ? [finalDownloadUrl] : [],
        downloadCount: 0,
        createdAt: Date.now()
      });

      setStatusMsg({ type: 'success', text: 'Livery berhasil dipublikasikan!' });
      setTitle('');
      setPreviewInput(''); setDownloadInput('');
      setPreviewFile(null); setDownloadFile(null);
      
    } catch (error: any) {
      setStatusMsg({ type: 'error', text: `Gagal: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLivery = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus livery ini?")) {
      await deleteDoc(doc(db, "liveries", id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      <SEO title="Admin Workspace" description="Engine Management Konten" />
      
      {/* --- MODAL CLOUDINARY GALLERY --- */}
      {showGallery && (
        <CloudinaryGallery 
          onSelect={handleSelectFromCloudinary} 
          onClose={() => setShowGallery(null)} 
        />
      )}

      {/* Kiri: Form Engine */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* --- BLOK PRESET FIREBASE --- */}
        <div className="bg-charcoal/40 backdrop-blur-xl border border-white/10 p-5 rounded-3xl glass-panel shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-terracotta">
              <Bookmark size={16} /> Preset Tersimpan
            </h3>
            <button onClick={savePresetToFirebase} type="button" className="text-xs bg-terracotta text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-terracotta/80 transition-colors">
              <Save size={14} /> Simpan Form Saat Ini
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {presets.length === 0 ? (
              <p className="text-xs text-white/40 italic">Belum ada preset. Isi form lalu klik Simpan.</p>
            ) : (
              presets.map(preset => (
                <div 
                  key={preset.id} 
                  onClick={() => applyPreset(preset)}
                  className="group flex items-center gap-2 bg-white/5 border border-white/10 hover:border-terracotta/50 cursor-pointer rounded-full pl-3 pr-1 py-1 transition-all"
                >
                  <span className="text-xs text-white/80 font-medium">
                    {preset.category || 'No Category'} • {preset.desc.game || preset.desc.truck || 'Data'}
                  </span>
                  <button 
                    onClick={(e) => deletePreset(preset.id, e)}
                    className="p-1 rounded-full text-white/30 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- BLOK UPLOAD ENGINE --- */}
        <div className="bg-charcoal/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl glass-panel shadow-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <UploadCloud className="text-terracotta" /> Upload Engine
          </h2>

          {statusMsg && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-medium border ${statusMsg.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1 uppercase tracking-wider">Judul Posting</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-deepgrey/50 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta/50 outline-none transition-colors" placeholder="Ex: Jetbus 5 Adiputro" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1 uppercase tracking-wider">Kategori</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-deepgrey/50 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta/50 outline-none transition-colors" placeholder="Ex: Racing, Anime, Realistic" />
              </div>
            </div>

            {/* Row 2: Deskripsi Artikel */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-sm font-semibold text-white/70">Data Deskripsi Artikel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={desc.truck} onChange={e => setDesc({...desc, truck: e.target.value})} placeholder="Nama Truck / Base" className="w-full bg-deepgrey/80 border border-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:border-terracotta/30" />
                <input type="text" value={desc.company} onChange={e => setDesc({...desc, company: e.target.value})} placeholder="Company / Perusahaan" className="w-full bg-deepgrey/80 border border-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:border-terracotta/30" />
                <input type="text" value={desc.game} onChange={e => setDesc({...desc, game: e.target.value})} placeholder="Jenis Game (Ex: ETS2, Roblox)" className="w-full bg-deepgrey/80 border border-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:border-terracotta/30" />
                <input type="text" value={desc.greeting} onChange={e => setDesc({...desc, greeting: e.target.value})} placeholder="Kalimat Sambutan (Welcome Text)" className="w-full bg-deepgrey/80 border border-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:border-terracotta/30" />
              </div>
            </div>

            {/* Row 3: Detail Tambahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1 uppercase tracking-wider">Credits / Author</label>
                <input type="text" value={credits} onChange={e => setCredits(e.target.value)} className="w-full bg-deepgrey/50 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta/50 outline-none transition-colors" placeholder="Ex: Base by X, Edit by Y" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1 uppercase tracking-wider">Tags (Pisahkan dengan koma)</label>
                <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-deepgrey/50 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta/50 outline-none transition-colors" placeholder="hd, scania, mod" />
              </div>
            </div>

            {/* Row 4: Manajemen Gambar (Dual Mode + Cloudinary Gallery) */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-terracotta flex items-center gap-2"><ImagePlus size={16}/> Manajemen Aset Visual</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preview Image Block */}
                <div className="bg-deepgrey/30 p-4 rounded-2xl border border-white/5">
                  <label className="block text-xs font-medium text-white/80 mb-3">Gambar Preview (Artikel)</label>
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <LinkIcon size={16} className="text-white/40" />
                      <input type="text" value={previewInput} onChange={e => setPreviewInput(e.target.value)} placeholder="Paste URL..." className="flex-1 bg-transparent border-b border-white/10 pb-1 text-sm outline-none focus:border-terracotta/50" disabled={!!previewFile} />
                      <button type="button" onClick={() => setShowGallery('preview')} className="text-xs bg-terracotta/20 text-terracotta border border-terracotta/30 px-2 py-1 rounded hover:bg-terracotta/30 transition">Galeri</button>
                    </div>
                    <div className="text-center text-xs text-white/30">--- ATAU ---</div>
                    <input type="file" accept="image/*" onChange={e => setPreviewFile(e.target.files?.[0] || null)} className="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-terracotta/10 file:text-terracotta hover:file:bg-terracotta/20" disabled={!!previewInput} />
                  </div>
                </div>

                {/* Download Image Block */}
                <div className="bg-deepgrey/30 p-4 rounded-2xl border border-white/5">
                  <label className="block text-xs font-medium text-white/80 mb-3">Gambar Asli (Download)</label>
                  <div className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <LinkIcon size={16} className="text-white/40" />
                      <input type="text" value={downloadInput} onChange={e => setDownloadInput(e.target.value)} placeholder="Paste URL..." className="flex-1 bg-transparent border-b border-white/10 pb-1 text-sm outline-none focus:border-terracotta/50" disabled={!!downloadFile} />
                      <button type="button" onClick={() => setShowGallery('download')} className="text-xs bg-terracotta/20 text-terracotta border border-terracotta/30 px-2 py-1 rounded hover:bg-terracotta/30 transition">Galeri</button>
                    </div>
                    <div className="text-center text-xs text-white/30">--- ATAU ---</div>
                    <input type="file" accept="image/*" onChange={e => setDownloadFile(e.target.files?.[0] || null)} className="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-terracotta/10 file:text-terracotta hover:file:bg-terracotta/20" disabled={!!downloadInput} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isUploading} className="w-full bg-terracotta text-white font-bold rounded-xl px-4 py-4 hover:bg-terracotta/90 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(226,114,91,0.3)] disabled:opacity-50">
              {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses Aset & Database...</> : 'Publikasikan Konten'}
            </button>
          </form>
        </div>
      </div>

      {/* Kanan: Mini Dashboard List Konten */}
      <div className="lg:col-span-4">
        <div className="bg-charcoal/30 border border-white/5 rounded-3xl overflow-hidden glass-panel sticky top-28">
          <div className="p-5 border-b border-white/5 bg-white/5">
            <h3 className="font-bold text-white/90">Koleksi Terpublikasi</h3>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
            {isLoading ? (
              <div className="p-10 text-center flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-terracotta" /></div>
            ) : liveries.length === 0 ? (
              <div className="p-10 text-center text-xs text-white/40">Database kosong.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {liveries.map((livery) => (
                  <div key={livery.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <img 
                      src={livery.previewImages?.[0] || livery.downloadImages?.[0] || (livery as any).imageUrl || ''} 
                      alt="" 
                      className="w-16 h-16 object-cover rounded-xl bg-deepgrey border border-white/10" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white truncate">{livery.title || 'Tanpa Judul'}</h4>
                      <p className="text-xs text-terracotta mt-1">{livery.category || 'Uncategorized'}</p>
                    </div>
                    <button onClick={() => handleDeleteLivery(livery.id)} className="p-2 text-white/30 hover:text-red-400 bg-black/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
