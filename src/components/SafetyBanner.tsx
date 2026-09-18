import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake, 
  Users, 
  Award, 
  CheckCircle2,
  Lock,
  Headphones,
  Check
} from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white rounded-[2.5rem] border border-stone-100 p-8 sm:p-16 shadow-premium space-y-16">
      
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] opacity-60 -mr-48 -mt-48" />

      <header className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border border-emerald-100/50">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Protokol Keamanan & Etika Medis</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-serif-display text-stone-900 leading-tight">
          Standar Operasional & Higienitas <br className="hidden sm:block" /> Kelas Dunia di Rumah Anda
        </h2>
        <p className="text-stone-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Mimah Spa menjamin 100% privasi, rasa aman, dan sterilitas setara klinis medis. Kami menghadirkan kenyamanan penuh untuk Anda dan keluarga di Kota Medan.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* Card 1 */}
        <article className="group p-10 rounded-[2rem] bg-stone-50/50 border border-stone-100 hover:border-emerald-200 hover:bg-white hover:shadow-premium transition-all duration-500 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shadow-sm border border-stone-100 group-hover:scale-110 transition-transform">
            <Award className="w-7 h-7" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900">Terapis Terverifikasi</h3>
            <p className="text-sm text-stone-500 leading-relaxed font-medium">
              Setiap mitra melewati seleksi latar belakang ketat & sertifikasi resmi BNSP untuk menjamin profesionalitas tinggi.
            </p>
          </div>
        </article>

        {/* Card 2 */}
        <article className="group p-10 rounded-[2rem] bg-stone-50/50 border border-stone-100 hover:border-emerald-200 hover:bg-white hover:shadow-premium transition-all duration-500 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shadow-sm border border-stone-100 group-hover:scale-110 transition-transform">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900">Sterilitas Medis</h3>
            <p className="text-sm text-stone-500 leading-relaxed font-medium">
              Kami menggunakan perlengkapan <em>disposable</em> sekali buang untuk memastikan kebersihan mutlak di setiap sesi.
            </p>
          </div>
        </article>

        {/* Card 3 */}
        <article className="group p-10 rounded-[2rem] bg-stone-50/50 border border-stone-100 hover:border-emerald-200 hover:bg-white hover:shadow-premium transition-all duration-500 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shadow-sm border border-stone-100 group-hover:scale-110 transition-transform">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900">Privasi & Etika</h3>
            <p className="text-sm text-stone-500 leading-relaxed font-medium">
              Eksklusif wanita melayani wanita. Menjunjung tinggi norma kesopanan untuk ketenangan hati Anda dan keluarga.
            </p>
          </div>
        </article>

      </div>

      {/* Guarantee callout */}
      <div className="relative z-10 p-8 bg-emerald-700 rounded-[2rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden shadow-lg shadow-emerald-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex items-center gap-6 relative z-10 text-center lg:text-left">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0 hidden sm:flex">
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold">Butuh Bantuan Lebih Cepat?</h4>
            <p className="text-emerald-100 text-sm font-medium">Hotline CS Mimah Spa siap melayani Anda setiap hari pukul 09.00 - 20.00 WIB.</p>
          </div>
        </div>

        <a
          href="https://wa.me/6285361991731?text=Halo%20Admin%20Mimah%20Spa,%20saya%20ingin%20tanya%20mengenai%20layanan%20home%20service"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 px-8 py-4 bg-white text-emerald-800 rounded-2xl font-bold text-sm shadow-xl hover:bg-emerald-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <span>Chat Hotline CS WhatsApp</span>
          <Check className="w-4 h-4 bg-emerald-100 rounded-full p-0.5" />
        </a>
      </div>

    </section>
  );
};
