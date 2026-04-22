/**
 * @version 2.3.0
 * @changelog
 * - [16-04-2026] Bugfix: Mengembalikan fitur Upload dari HP dan memperbaiki sistem Live Preview menggunakan URL.createObjectURL.
 * - [16-04-2026] UX Improvement: Mengganti window.confirm bawaan browser dengan Custom Modal UI OLED untuk penghapusan data.
 * - [16-04-2026] Rollback: Menggunakan base UI versi 2.2.0 agar struktur card di halaman Home tetap presisi.
 */

import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { UploadCloud, Trash2, Save, Link as LinkIcon, ImagePlus, Loader2, X, Bookmark, AlertTriangle } from 'lucide-react';
import { db } from '../services/firebase';
import { uploadToCloudinary } from '../services/cloudinary';
import { useLivery, LiveryDescription } from '../hooks/useLivery';
import { SEO } from '../components/SEO';
import { CloudinaryGallery } from '../components/CloudinaryGallery';

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
  
  // State UI & Modals
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [showGallery, setShowGallery] = useState<'preview' | 'download' | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null); // State untuk Custom Modal Delete
  
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
    e.stopPropagation(); 
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

  // --- LOGIKA CUSTOM MODAL DELETE ---
  const triggerDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteLivery = async () => {
    if (deleteConfirmId) {
      await deleteDoc(doc(db, "liveries", deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 relative">
      <SEO title="Admin Workspace" description="Engine Management Konten" />
      
      {/* --- CUSTOM MODAL DELETE --- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-red-500/20">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-2">Hapus Publikasi?</h3>
            <p className="text-sm text-white/50 text-center mb-6 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Data livery akan dihapus secara permanen dari database Firestore.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 px-4 rounded-xl bg-[#111] border border-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-bold">
                Batal
              </button>
              <button onClick={confirmDeleteLivery} className="flex-1 py-3 px-4 rounded-xl bg-red-500/20 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CLOUDINARY GALLERY --- */}
      {showGallery && (
        <CloudinaryGallery 
          onSelect={handleSelectFromCloudinary} 
          onClose={() => setShowGallery(null)} 
        />
      )}

      {/* Kiri: Form Engine */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* --- BLOK PRESET FIREBASE (Solid UI) --- */}
        <div className="bg-black border border-white/10 p-5 rounded-3xl shadow-xl">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-terracotta">
              <Bookmark size={16} /> Preset Tersimpan
            </h3>
            <button onClick={savePresetToFirebase} type="button" className="text-xs bg-[#111] border border-terracotta text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-terracotta transition-colors">
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
                  className="group flex items-center gap-2 bg-[#0A0A0A] border border-white/10 hover:border-terracotta cursor-pointer rounded-full pl-3 pr-1 py-1 transition-all"
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

        {/* --- BLOK UPLOAD ENGINE (Solid UI) --- */}
        <div className="bg-black border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-black flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <div className="p-2 bg-[#111] rounded-lg border border-white/5">
              <UploadCloud className="text-terracotta" size={20} />
            </div>
            Publish Assets
          </h2>

          {statusMsg && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-bold border ${statusMsg.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Judul Publikasi</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-terracotta outline-none transition-colors" placeholder="Ex: Jetbus 5 Adiputro" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Kategori Asset</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-terracotta outline-none transition-colors" placeholder="Ex: Racing, Anime, Realistic" />
              </div>
            </div>

            {/* Row 2: Deskripsi Artikel */}
            <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/5 space-y-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest border-b border-white/5 pb-2">Spesifikasi Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={desc.truck} onChange={e => setDesc({...desc, truck: e.target.value})} placeholder="Nama Truck / Base" className="w-full bg-[#111] border border-white/5 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-terracotta/50" />
                <input type="text" value={desc.company} onChange={e => setDesc({...desc, company: e.target.value})} placeholder="Company / Perusahaan" className="w-full bg-[#111] border border-white/5 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-terracotta/50" />
                <input type="text" value={desc.game} onChange={e => setDesc({...desc, game: e.target.value})} placeholder="Platform Game (Ex: ETS2, Roblox)" className="w-full bg-[#111] border border-white/5 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-terracotta/50" />
                <input type="text" value={desc.greeting} onChange={e => setDesc({...desc, greeting: e.target.value})} placeholder="Deskripsi/Sambutan Artikel Singkat" className="w-full bg-[#111] border border-white/5 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-terracotta/50" />
              </div>
            </div>

            {/* Row 3: Detail Tambahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Author / Credits</label>
                <input type="text" value={credits} onChange={e => setCredits(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-terracotta outline-none transition-colors" placeholder="Ex: Base by X, Edit by Y" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Search Tags (Koma)</label>
                <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-terracotta outline-none transition-colors" placeholder="hd, scania, mod" />
              </div>
            </div>

            {/* Row 4: Manajemen Gambar (Fix Preview & Fix Upload HP) */}
            <div className="space-y-5 pt-6 border-t border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImagePlus className="text-terracotta" size={18}/> Image Routing Engine
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Preview Asset */}
                <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Display Asset (Preview)</label>
                      <button type="button" onClick={() => setShowGallery('preview')} className="text-[10px] bg-terracotta text-white px-2 py-1 rounded font-bold hover:bg-terracotta/80 transition">Cloudinary Gallery</button>
                    </div>
                    
                    {/* Live Preview Box with URL / File Support */}
                    {(previewInput || previewFile) && (
                      <div className="mb-4 w-full h-32 bg-black border border-white/10 rounded-xl overflow-hidden relative group flex items-center justify-center">
                        <img 
                          src={previewFile ? URL.createObjectURL(previewFile) : previewInput} 
                          alt="Preview Asset" 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL&bg=000000&textColor=E2725B' }}
                        />
                        <button type="button" onClick={() => { setPreviewInput(''); setPreviewFile(null); }} className="absolute top-2 right-2 bg-black/80 p-1 rounded text-red-400 hover:text-red-500 border border-white/10"><X size={14}/></button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <LinkIcon size={16} className="text-white/20 shrink-0" />
                        <input 
                          type="text" 
                          value={previewInput} 
                          onChange={e => { setPreviewInput(e.target.value); setPreviewFile(null); }} 
                          placeholder="Paste URL HTTPS..." 
                          className="w-full bg-transparent border-b border-white/10 pb-2 text-sm outline-none focus:border-terracotta disabled:opacity-30" 
                          disabled={!!previewFile} 
                        />
                      </div>

                      <div className="flex items-center gap-2 opacity-50">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Atau Upload Dari HP</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                      </div>

                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if(file) {
                            setPreviewFile(file);
                            setPreviewInput(''); // Otomatis bersihin URL kalau pilih file
                          }
                        }} 
                        className="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border border-white/10 file:bg-[#111] file:text-terracotta hover:file:bg-[#222] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                        disabled={previewInput.length > 0} 
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Download Asset */}
                <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Source Asset (Download)</label>
                      <button type="button" onClick={() => setShowGallery('download')} className="text-[10px] bg-[#111] text-terracotta border border-terracotta/50 px-2 py-1 rounded font-bold hover:bg-terracotta hover:text-white transition">Cloudinary Gallery</button>
                    </div>

                    {/* Live Preview Box with URL / File Support */}
                    {(downloadInput || downloadFile) && (
                      <div className="mb-4 w-full h-32 bg-black border border-white/10 rounded-xl overflow-hidden relative group flex items-center justify-center">
                         <img 
                           src={downloadFile ? URL.createObjectURL(downloadFile) : downloadInput} 
                           alt="Download Source" 
                           className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all"
                           onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL&bg=000000&textColor=E2725B' }}
                         />
                         <button type="button" onClick={() => { setDownloadInput(''); setDownloadFile(null); }} className="absolute top-2 right-2 bg-black/80 p-1 rounded text-red-400 hover:text-red-500 border border-white/10"><X size={14}/></button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <LinkIcon size={16} className="text-white/20 shrink-0" />
                        <input 
                          type="text" 
                          value={downloadInput} 
                          onChange={e => { setDownloadInput(e.target.value); setDownloadFile(null); }} 
                          placeholder="Paste URL HTTPS..." 
                          className="w-full bg-transparent border-b border-white/10 pb-2 text-sm outline-none focus:border-terracotta disabled:opacity-30" 
                          disabled={!!downloadFile} 
                        />
                      </div>

                      <div className="flex items-center gap-2 opacity-50">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Atau Upload Dari HP</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                      </div>

                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if(file) {
                            setDownloadFile(file);
                            setDownloadInput(''); // Otomatis bersihin URL kalau pilih file
                          }
                        }} 
                        className="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border border-white/10 file:bg-[#111] file:text-terracotta hover:file:bg-[#222] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                        disabled={downloadInput.length > 0} 
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <button type="submit" disabled={isUploading || (!previewInput && !previewFile) || (!downloadInput && !downloadFile)} className="w-full bg-white text-black font-black uppercase tracking-widest rounded-xl px-4 py-5 hover:bg-terracotta hover:text-white transition-all flex justify-center items-center gap-3 disabled:opacity-30 disabled:bg-[#111] disabled:text-white">
              {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Merekam ke Database...</> : 'Deploy Data'}
            </button>
          </form>
        </div>
      </div>

      {/* Kanan: Mini Dashboard List Konten (Solid UI) */}
      <div className="lg:col-span-4">
        <div className="bg-black border border-white/10 rounded-3xl overflow-hidden shadow-xl sticky top-28">
          <div className="p-5 border-b border-white/10 bg-[#0A0A0A]">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Aset Terpublikasi</h3>
          </div>
          
          <div className="max-h-[700px] overflow-y-auto hide-scrollbar">
            {isLoading ? (
              <div className="p-10 text-center flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-terracotta" /></div>
            ) : liveries.length === 0 ? (
              <div className="p-10 text-center text-xs text-white/40">Database kosong.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {liveries.map((livery) => (
                  <div key={livery.id} className="p-4 flex items-center gap-4 hover:bg-[#111] transition-colors group">
                    <img 
                      src={livery.previewImages?.[0] || livery.downloadImages?.[0] || (livery as any).imageUrl || ''} 
                      alt="" 
                      loading="lazy"
                      className="w-14 h-14 object-cover rounded-lg bg-[#0A0A0A] border border-white/5 group-hover:border-terracotta/50 transition-colors" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{livery.title || 'Tanpa Judul'}</h4>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-terracotta mt-1">{livery.category || 'Uncategorized'}</p>
                    </div>
                    {/* TRIGGER CUSTOM MODAL */}
                    <button onClick={() => triggerDelete(livery.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
