import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, FlaskConical } from 'lucide-react';

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500&auto=format&fit=crop&q=60',
    title: 'Sprei Disposable',
    description: 'Sprei & sarung bantal sekali buang untuk setiap sesi.'
  },
  {
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop&q=60',
    title: 'Sterilisasi Alat',
    description: 'Alat bekam & kerokan disterilkan dengan UV Sterilizer.'
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?w=500&auto=format&fit=crop&q=60',
    title: 'Handuk Bersegel',
    description: 'Handuk dicuci suhu tinggi & dikemas dalam segel plastik.'
  },
  {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&auto=format&fit=crop&q=60',
    title: 'Minyak Organik',
    description: 'Minyak pijat murni tanpa bahan kimia berbahaya.'
  }
];

export const SterilizationGallery: React.FC = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Komitmen Kehigienisan Bintang Lima</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold font-serif-display text-stone-900 tracking-tight">
          Standar Sterilisasi Peralatan Mimah Spa
        </h2>
        <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto font-medium">
          Kesehatan & kenyamanan Anda adalah prioritas utama kami. Kami menerapkan standar kebersihan medis ketat di setiap sesi pemesanan.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((img, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-2xl bg-stone-200 aspect-[4/5] border border-stone-200">
            <img 
              src={img.url} 
              alt={img.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="font-bold text-sm">{img.title}</h3>
              <p className="text-[10px] text-stone-500 leading-tight">{img.description}</p>
            </div>
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-soft-hover">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-stone-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-stone-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">Masker & Hand Sanitizer</h4>
            <p className="text-xs text-stone-500 mt-1">Terapis wajib menggunakan masker dan mencuci tangan sebelum & sesudah sesi.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-stone-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-stone-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">Aromaterapi Alami</h4>
            <p className="text-xs text-stone-500 mt-1">Penyemprotan aromaterapi penenang yang juga berfungsi sebagai disinfektan udara.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-stone-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-stone-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">Alat Sekali Pakai</h4>
            <p className="text-xs text-stone-500 mt-1">Jarum bekam (untuk bekam basah) selalu baru & tersegel, hanya dibuka di depan Anda.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
