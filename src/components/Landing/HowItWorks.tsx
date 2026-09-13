import React from 'react';
import { CalendarCheck, ShieldCheck, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Pilih Perawatan',
      description: 'Pilih layanan spa dan pijat yang sesuai kebutuhan Anda melalui katalog digital kami.',
      icon: <CalendarCheck className="w-6 h-6" />,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100'
    },
    {
      number: '02',
      title: 'Terapis Tiba',
      description: 'Terapis bersertifikat kami akan hadir di lokasi Anda dengan peralatan lengkap & steril.',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100'
    },
    {
      number: '03',
      title: 'Relaksasi Total',
      description: 'Nikmati perawatan spa bintang lima tanpa perlu keluar rumah. Bayar aman via aplikasi.',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'bg-teal-50 text-teal-600',
      border: 'border-teal-100'
    }
  ];

  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[10px] font-bold uppercase tracking-widest">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Easy Order Process</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif-display text-stone-900 leading-tight">
          Hadirkan Ketenangan ke Rumah Anda <br className="hidden sm:block" /> Dalam 3 Langkah Mudah
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Lupakan kemacetan Medan. Kami membawa pengalaman spa premium langsung ke depan pintu Anda dengan standar higienitas tertinggi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-4">
        {/* Connection Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px border-t border-dashed border-stone-200 -z-10 translate-y-[-2rem]" />

        {steps.map((s, idx) => (
          <div
            key={s.number}
            className="group relative flex flex-col items-center text-center space-y-6 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-soft hover:shadow-premium transition-all duration-500"
          >
            <div className={`w-16 h-16 rounded-2xl ${s.color} border ${s.border} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
              {s.icon}
            </div>

            <div className="space-y-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-1">Langkah {s.number}</span>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{s.title}</h3>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed font-medium">
                {s.description}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="md:hidden flex justify-center py-2">
                <ArrowRight className="w-5 h-5 text-stone-200 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
