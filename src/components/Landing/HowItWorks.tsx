import React from 'react';
import { CalendarCheck, ShieldCheck, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 'Langkah 1',
      title: 'Pilih Layanan & Waktu Sesi',
      description: 'Tentukan jenis perawatan spa, durasi, serta waktu kedatangan terapis wanita bersertifikat BNSP sesuai keinginan Anda.',
      icon: <CalendarCheck className="w-6 h-6" />,
      color: 'bg-emerald-50 text-emerald-700',
      border: 'border-emerald-100/80'
    },
    {
      step: 'Langkah 2',
      title: 'Terapis Tiba di Lokasi',
      description: 'Mitra terapis profesional hadir tepat waktu membawa koper perlengkapan steril, sprei disposable sekali buang, & minyak aromaterapi murni.',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'bg-amber-50 text-amber-700',
      border: 'border-amber-100/80'
    },
    {
      step: 'Langkah 3',
      title: 'Nikmati Spa Bintang Lima',
      description: 'Rasakan sensasi relaksasi maksimal dan kebugaran tubuh langsung di kenyamanan rumah, hotel, atau apartemen Anda.',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'bg-teal-50 text-teal-700',
      border: 'border-teal-100/80'
    }
  ];

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col items-center text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold uppercase tracking-widest">
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
          <span>Alur Pemesanan Mudah & Cepat</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif-display text-stone-900 leading-tight">
          Hadirkan Spa Mewah ke Rumah Anda <br className="hidden sm:block" /> Dalam 3 Langkah Praktis
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-lg font-medium">
          Tanpa antre, tanpa kemacetan. Terapis wanita bersertifikat resmi siap melayani relaksasi tubuh Anda dengan standar higienis tinggi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative px-2">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col items-center text-center space-y-5 bg-white p-7 rounded-[2rem] border border-stone-200/80 shadow-soft hover:shadow-premium hover:border-emerald-200 transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-2xl ${s.color} border ${s.border} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300`}>
              {s.icon}
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-extrabold uppercase tracking-wider">
                {s.step}
              </span>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                {s.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-medium">
                {s.description}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="md:hidden flex justify-center py-1">
                <ArrowRight className="w-4 h-4 text-stone-300 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
