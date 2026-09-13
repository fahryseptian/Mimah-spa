import React from 'react';
import { ShieldCheck, Star, Clock, MapPin, ArrowRight, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Therapist } from '../../types';

export const FeaturedTherapists: React.FC = () => {
  const { 
    therapists, 
    selectedCity, 
    setSelectedTherapistForBooking, 
    setIsBookingModalOpen,
    setActiveCustomerTab 
  } = useApp();

  // Show top therapists in current city or top general
  const onlineTherapists = therapists.filter(t => t.status === 'online').slice(0, 4);

  const handleBook = (t: Therapist) => {
    setSelectedTherapistForBooking(t);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mitra Terverifikasi & Siap Berangkat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900">
            Terapis Profesional Aktif di Area Medan & Sekitarnya
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Seluruh mitra memiliki sertifikasi BNSP resmi atau STR Tenaga Kesehatan dengan protokol koper steril.
          </p>
        </div>

        <button
          onClick={() => setActiveCustomerTab('therapists')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 shrink-0 self-start sm:self-center"
        >
          <span>Lihat Semua Mitra</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {onlineTherapists.map((t) => (
          <div
            key={t.id}
            className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 flex flex-col justify-between hover:border-emerald-600 hover:shadow-soft transition-all group"
          >
            <div>
              <div className="relative mb-3">
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-44 rounded-xl object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-xs text-stone-900 text-[10px] font-bold border border-white/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Online</span>
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[10px] font-black shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-stone-950" />
                    <span>{t.rating}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {t.name}
                  </h4>
                  <span className="text-[10px] text-stone-500 font-medium">
                    Exp: {t.experienceYears} th
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{t.baseKecamatan}, {t.baseCity}</span>
                </div>

                <p className="text-[11px] text-stone-600 line-clamp-2 pt-1">
                  {t.bio}
                </p>

                <div className="pt-2 flex flex-wrap gap-1">
                  {(t.specialties || []).slice(0, 2).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white rounded-md text-[10px] text-stone-700 font-medium border border-stone-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-stone-200/70">
              <button
                onClick={() => handleBook(t)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Pilih Terapis Ini
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
