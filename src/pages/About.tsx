/**
 * @version 1.0.0
 * @changelog
 * - [16-04-2026] Pembuatan halaman About Us dengan standar E-E-A-T AdSense.
 * - [16-04-2026] Implementasi Solid UI (Pitch Black) untuk konsistensi tema global.
 */

import React from 'react';
import { Shield, Target, Users } from 'lucide-react';
import { SEO } from '../components/SEO';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-28 pb-20 px-6">
      <SEO 
        title="Tentang Kami - Sahal Arbani Livery" 
        description="Pelajari lebih lanjut tentang visi, misi, dan tim di balik platform Sahal Arbani Livery." 
      />
      
      <div className="max-w-4xl mx-auto space-y-16">
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Tentang <span className="text-terracotta">Kami</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Sahal Arbani Livery didirikan dengan satu tujuan sederhana: menyediakan aset modifikasi visual game dengan kualitas premium, resolusi tinggi, dan estetika yang modern.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black border border-white/10 p-8 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl flex items-center justify-center mx-auto text-terracotta border border-white/5">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold">Visi Kami</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Menjadi pusat direktori aset game terbesar dan paling terpercaya di Indonesia dengan mengutamakan kualitas desain dan detail estetika.
            </p>
          </div>
          
          <div className="bg-black border border-white/10 p-8 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl flex items-center justify-center mx-auto text-terracotta border border-white/5">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold">Komunitas</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Membangun ekosistem kreatif yang saling mendukung antara para pembuat mod, desainer livery, dan pemain game.
            </p>
          </div>

          <div className="bg-black border border-white/10 p-8 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl flex items-center justify-center mx-auto text-terracotta border border-white/5">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold">Integritas</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Setiap karya yang kami publikasikan telah melalui proses kurasi ketat dengan menghargai hak cipta kreator aslinya.
            </p>
          </div>
        </div>

        <section className="prose prose-invert prose-lg max-w-none bg-black border border-white/10 p-10 rounded-3xl">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mb-6">Sejarah Platform</h2>
          <p className="text-white/70 font-light leading-relaxed">
            Berawal dari hobi personal dalam memodifikasi permainan simulator, platform ini lahir dari keresahan akan sulitnya mencari livery dengan kualitas tinggi yang terkumpul dalam satu tempat. Banyak karya hebat yang tersebar di internet namun sulit diakses atau kehilangan kualitas aslinya karena kompresi yang buruk.
          </p>
          <p className="text-white/70 font-light leading-relaxed">
            Sahal Arbani Livery hadir untuk memecahkan masalah tersebut. Kami tidak hanya mengumpulkan aset, tetapi juga memastikan setiap file yang dapat diunduh bebas dari tautan manipulatif, aman untuk perangkat Anda, dan disajikan dengan antarmuka yang bersih tanpa gangguan.
          </p>
        </section>
      </div>
    </div>
  );
};
