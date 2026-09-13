import React from 'react';
import { User, Sparkles, Check, Star, Users, Award, ShieldCheck } from 'lucide-react';
import { Therapist, TherapistGenderPreference } from '../../types';

interface BookingStepTherapistProps {
  selectionMode: 'auto' | 'specific';
  setSelectionMode: (mode: 'auto' | 'specific') => void;
  genderPreference: TherapistGenderPreference;
  setGenderPreference: (preference: TherapistGenderPreference) => void;
  chosenTherapistId: string | null;
  setChosenTherapistId: (id: string | null) => void;
  matchedTherapists: Therapist[];
  assignedTherapist: Therapist;
}

export const BookingStepTherapist: React.FC<BookingStepTherapistProps> = ({
  selectionMode,
  setSelectionMode,
  genderPreference,
  setGenderPreference,
  chosenTherapistId,
  setChosenTherapistId,
  matchedTherapists,
  assignedTherapist,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Selection Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setSelectionMode('auto')}
          className={`py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectionMode === 'auto'
              ? 'bg-white text-emerald-800 shadow-soft border border-emerald-100'
              : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Rekomendasi Otomatis</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectionMode('specific')}
          className={`py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectionMode === 'specific'
              ? 'bg-white text-emerald-800 shadow-soft border border-emerald-100'
              : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pilih Terapis Sendiri</span>
        </button>
      </div>

      {/* FIXED GENDER STATEMENT */}
      <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-600">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Keamanan & Kenyamanan Terjamin:</strong> Demi menjunjung tinggi privasi Anda, Mimah Spa secara eksklusif hanya bermitra dengan <strong>terapis wanita profesional bersertifikat resmi</strong>.
        </span>
      </div>

      {/* AUTO MODE */}
      {selectionMode === 'auto' && (
        <div className="space-y-5 animate-fade-in">
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 space-y-3.5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center overflow-hidden shadow-inner">
                  {assignedTherapist?.photoUrl ? (
                    <img 
                      src={assignedTherapist.photoUrl} 
                      alt={assignedTherapist.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-8 h-8 text-emerald-700" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white animate-pulse" />
                </div>
              </div>

              <div className="space-y-1 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  Terapis Terdekat Terpilih
                </div>
                <h4 className="text-sm font-extrabold text-stone-900">{assignedTherapist?.name || 'Mencari Mitra Terapis...'}</h4>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-stone-500">
                  <span className="flex items-center gap-0.5 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {assignedTherapist?.rating || '4.9'}
                  </span>
                  <span>•</span>
                  <span>{assignedTherapist?.experienceYears || '5'}+ Tahun Pengalaman</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">{assignedTherapist?.completedOrders || '100'}+ Order Selesai</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-emerald-800 bg-white/60 p-3 rounded-xl border border-emerald-100/50 leading-relaxed">
              Sistem telah mendeteksi <strong>{assignedTherapist?.name}</strong> sebagai mitra terdekat dari lokasi Anda di {assignedTherapist?.baseKecamatan || 'Medan'}. Ia memiliki tingkat kepuasan pelanggan yang luar biasa dan siap berangkat memboyong perlengkapan spa steril ke tempat Anda.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Garansi Standar Mimah Spa:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Mitra Terapis Wanita Bersertifikat BNSP Resmi',
                'Membawa Ranjang Lipat & Kain Batik Steril',
                'Lolos Tes Vaksinasi & Standard Kesehatan',
                'Minyak Atsiri Alami Berkualitas Premium',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-100 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] text-stone-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SPECIFIC SELECTION MODE */}
      {selectionMode === 'specific' && (
        <div className="space-y-4 animate-fade-in max-h-[50vh] overflow-y-auto pr-1">
          <p className="text-xs text-stone-500">
            Berikut adalah daftar mitra terapis Mimah Spa di Medan yang sedang aktif & online hari ini. Silakan pilih terapis favorit Anda:
          </p>

          <div className="space-y-3">
            {matchedTherapists.map((therapist) => {
              const isSelected = chosenTherapistId === therapist.id || (!chosenTherapistId && assignedTherapist?.id === therapist.id);
              return (
                <div
                  key={therapist.id}
                  onClick={() => setChosenTherapistId(therapist.id)}
                  className={`p-4 border rounded-2xl flex flex-col sm:flex-row gap-3.5 transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-soft ring-1 ring-emerald-500/50'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="relative self-center sm:self-start">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-stone-100 bg-stone-100 shadow-inner shrink-0">
                      <img
                        src={therapist.photoUrl}
                        alt={therapist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                      <h4 className="text-sm font-extrabold text-stone-900 flex items-center justify-center sm:justify-start gap-1.5">
                        <span>{therapist.name}</span>
                        {therapist.isTopTherapist && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wider">
                            <Award className="w-2.5 h-2.5" /> Top
                          </span>
                        )}
                      </h4>
                      <button
                        type="button"
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all self-center sm:self-auto cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-soft'
                            : 'bg-white text-stone-700 border border-stone-200 group-hover:bg-emerald-50 group-hover:border-emerald-200'
                        }`}
                      >
                        {isSelected ? 'Terpilih ✓' : 'Pilih Terapis'}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-xs text-stone-500">
                      <span className="flex items-center gap-0.5 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {therapist.rating}
                      </span>
                      <span>•</span>
                      <span>{therapist.experienceYears} Tahun Pengalaman</span>
                      <span>•</span>
                      <span>{therapist.completedOrders} Order Selesai</span>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed italic">
                      "{therapist.bio}"
                    </p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-1 pt-1">
                      {(therapist.specialties || []).slice(0, 3).map((spec, idx) => (
                        <span key={idx} className="bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded-md border border-stone-200/50">
                          {spec}
                        </span>
                      ))}
                      {(therapist.specialties || []).length > 3 && (
                        <span className="bg-stone-50 text-stone-500 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          +{(therapist.specialties || []).length - 3} Lainnya
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
