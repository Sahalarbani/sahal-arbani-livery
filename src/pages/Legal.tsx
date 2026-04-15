/**
 * @version 1.0.0
 * @changelog
 * - [16-04-2026] Pembuatan komponen Contact, Privacy, dan Terms terintegrasi untuk E-E-A-T AdSense.
 * - [16-04-2026] Penulisan draft kebijakan privasi standar periklanan Google Ads (Log Files & Cookies).
 */

import React from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { SEO } from '../components/SEO';

// --- KOMPONEN CONTACT ---
export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-28 pb-20 px-6">
      <SEO title="Kontak - Sahal Arbani Livery" description="Hubungi tim Sahal Arbani Livery untuk kerja sama, pelaporan bug, atau pertanyaan hak cipta." />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Hubungi <span className="text-terracotta">Kami</span></h1>
        <p className="text-white/60 mb-10">Punya pertanyaan, tawaran kerja sama, atau ingin melaporkan pelanggaran hak cipta? Kirimkan pesan melalui formulir di bawah ini.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6 bg-black p-8 rounded-3xl border border-white/10 h-fit">
            <h3 className="text-xl font-bold mb-4">Informasi Kontak</h3>
            <div className="flex items-center gap-4 text-white/70">
              <Mail className="text-terracotta" />
              <span>support@sahalarbani.com</span>
            </div>
            <div className="flex items-center gap-4 text-white/70">
              <MapPin className="text-terracotta" />
              <span>Semarang, Jawa Tengah, Indonesia</span>
            </div>
          </div>

          <div className="bg-black p-8 rounded-3xl border border-white/10">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <input type="text" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-terracotta/50" placeholder="Masukkan nama Anda" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Email</label>
                <input type="email" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-terracotta/50" placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Pesan</label>
                <textarea rows={4} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-terracotta/50" placeholder="Ketik pesan Anda di sini..."></textarea>
              </div>
              <button className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                <Send size={18} /> Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN PRIVACY POLICY ---
export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-28 pb-20 px-6">
      <SEO title="Kebijakan Privasi - Sahal Arbani Livery" description="Kebijakan privasi dan pengelolaan data pengguna Sahal Arbani Livery sesuai standar periklanan." />
      <div className="max-w-3xl mx-auto bg-black border border-white/10 p-8 md:p-12 rounded-3xl prose prose-invert prose-terracotta">
        <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-6">Kebijakan Privasi</h1>
        <p>Terakhir diperbarui: April 2026</p>
        <p>Di Sahal Arbani Livery, privasi pengunjung kami adalah salah satu prioritas utama kami. Dokumen Kebijakan Privasi ini berisi jenis informasi yang dikumpulkan dan dicatat oleh kami dan bagaimana kami menggunakannya.</p>
        
        <h3>File Log</h3>
        <p>Sahal Arbani Livery mengikuti prosedur standar menggunakan file log. File-file ini mencatat pengunjung ketika mereka mengunjungi situs web. Semua perusahaan hosting melakukan ini dan merupakan bagian dari analitik layanan hosting. Informasi yang dikumpulkan oleh file log termasuk alamat protokol internet (IP), jenis browser, Internet Service Provider (ISP), stempel tanggal dan waktu, halaman rujukan/keluar, dan mungkin jumlah klik.</p>

        <h3>Cookie dan Web Beacon</h3>
        <p>Seperti situs web lainnya, Sahal Arbani Livery menggunakan 'cookie'. Cookie ini digunakan untuk menyimpan informasi termasuk preferensi pengunjung, dan halaman di situs web yang diakses atau dikunjungi pengunjung. Informasi tersebut digunakan untuk mengoptimalkan pengalaman pengguna dengan menyesuaikan konten halaman web kami berdasarkan jenis browser pengunjung dan/atau informasi lainnya.</p>

        <h3>Cookie DART Google DoubleClick</h3>
        <p>Google adalah salah satu vendor pihak ketiga di situs kami. Google juga menggunakan cookie, yang dikenal sebagai cookie DART, untuk menayangkan iklan kepada pengunjung situs kami berdasarkan kunjungan mereka ke internet. Namun, pengunjung dapat memilih untuk menolak penggunaan cookie DART dengan mengunjungi Kebijakan Privasi jaringan iklan dan konten Google di URL berikut: <a href="https://policies.google.com/technologies/ads" className="text-terracotta hover:underline">https://policies.google.com/technologies/ads</a></p>

        <h3>Persetujuan</h3>
        <p>Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui syarat dan ketentuannya.</p>
      </div>
    </div>
  );
};

// --- KOMPONEN TERMS OF SERVICE ---
export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-28 pb-20 px-6">
      <SEO title="Ketentuan Layanan - Sahal Arbani Livery" description="Syarat dan ketentuan penggunaan aset yang disediakan oleh Sahal Arbani Livery." />
      <div className="max-w-3xl mx-auto bg-black border border-white/10 p-8 md:p-12 rounded-3xl prose prose-invert prose-terracotta">
        <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-6">Ketentuan Layanan</h1>
        <p>Dengan mengakses atau menggunakan situs web Sahal Arbani Livery, Anda setuju untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda dilarang menggunakan situs ini.</p>
        
        <h3>1. Lisensi Penggunaan</h3>
        <p>Semua aset (livery, mod, template) yang disediakan di situs ini diberikan kepada Anda secara gratis untuk penggunaan personal. Anda dilarang keras untuk:</p>
        <ul>
          <li>Mengunggah ulang (re-upload) aset dari situs ini ke platform lain tanpa izin eksplisit.</li>
          <li>Mengklaim karya milik kreator pihak ketiga sebagai milik Anda sendiri.</li>
          <li>Menjual atau memonetisasi aset yang diunduh dari Sahal Arbani Livery.</li>
        </ul>

        <h3>2. Penafian (Disclaimer)</h3>
        <p>Semua materi di situs web Sahal Arbani Livery disediakan "sebagaimana adanya". Kami tidak memberikan jaminan, tersurat maupun tersirat, dan dengan ini menolak semua jaminan lainnya, termasuk namun tidak terbatas pada, jaminan tersirat tentang kelayakan untuk diperdagangkan, kesesuaian untuk tujuan tertentu, atau non-pelanggaran kekayaan intelektual.</p>

        <h3>3. Revisi dan Ralat</h3>
        <p>Materi yang muncul di situs web kami dapat mencakup kesalahan teknis, tipografi, atau fotografi. Kami tidak menjamin bahwa salah satu materi di situs web kami akurat, lengkap, atau mutakhir. Kami dapat mengubah materi yang terdapat di situs web kami kapan saja tanpa pemberitahuan.</p>

        <h3>4. Tautan Pihak Ketiga</h3>
        <p>Kami belum meninjau semua situs yang ditautkan ke situs web kami dan tidak bertanggung jawab atas isi dari situs tertaut tersebut. Dimasukkannya tautan apa pun tidak menyiratkan dukungan oleh Sahal Arbani Livery.</p>
      </div>
    </div>
  );
};
