import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Award, 
  UserCheck, 
  ChevronRight, 
  Sparkles,
  Phone,
  CheckCircle,
  Briefcase,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Therapist, TherapistGenderPreference } from '../../types';
import { TherapistRegistrationModal } from './TherapistRegistrationModal';

export const TherapistList: React.FC = () => {
  const { 
    therapists, 
    selectedCity, 
    setSelectedTherapistForBooking, 
    setIsBookingModalOpen,
    setViewingTherapist 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Filter therapists
  const filteredTherapists = therapists.filter(t => {
    const specialties = t.specialties || [];
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.baseKecamatan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = specialtyFilter === 'all' || specialties.some(s => s.toLowerCase().includes(specialtyFilter.toLowerCase()));

    return matchesSearch && matchesSpecialty;
  });

  const handleBookTherapist = (therapist: Therapist) => {
    setSelectedTherapistForBooking(therapist);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Registration CTA Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Terapis Terverifikasi & Tersertifikasi Resmi</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif-display">
              Direktori Mitra Terapis Profesional
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Seluruh mitra terapis kami telah melewati uji kompetensi BNSP/Kemenkes, pemeriksaan latar belakang (SKCK), serta protokol higienitas koper peralatan steril.
            </p>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 text-emerald-300" />
            <span>Gabung Jadi Mitra</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4 border-t border-stone-100">
          
          {/* Search bar */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama terapis, spesialisasi, atau kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {/* Specialty Filter */}
          <div className="sm:col-span-4">
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Semua Spesialisasi</option>
              <option value="Tradisional">Pijat Tradisional</option>
              <option value="Ibu Hamil">Ibu Hamil / Bidan</option>
              <option value="Deep Tissue">Deep Tissue & Sport</option>
              <option value="Fisioterapi">Fisioterapi Medis</option>
              <option value="Bekam">Bekam Steril</option>
              <option value="Refleksi">Refleksi Kaki</option>
            </select>
          </div>

        </div>
      </div>

      {/* Therapist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapists.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-soft transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Card Header Profile */}
              <div className="p-5 pb-4 border-b border-stone-100 flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={therapist.photoUrl}
                    alt={therapist.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-xs"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      therapist.status === 'online' ? 'bg-emerald-500' : 'bg-stone-400'
                    }`}
                    title={therapist.status === 'online' ? 'Siap Menerima Pesanan' : 'Sedang Libur / Istirahat'}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm font-bold text-stone-900 truncate">{therapist.name}</h3>
                    {therapist.isTopTherapist && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        ★ TOP
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {therapist.rating}
                    </span>
                    <span>({therapist.reviewCount} ulasan)</span>
                    <span>•</span>
                    <span className="font-medium text-stone-700">{therapist.age} Tahun</span>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">Pos: {therapist.baseKecamatan}, {therapist.baseCity}</span>
                  </div>
                </div>
              </div>

              {/* Badges & Stats */}
              <div className="px-5 py-3 bg-stone-50/70 border-b border-stone-100 grid grid-cols-2 gap-2 text-center text-[11px]">
                <div className="p-1.5 bg-white rounded-lg border border-stone-200/70">
                  <div className="text-stone-600 text-[10px]">Pengalaman</div>
                  <div className="font-bold text-stone-800">{therapist.experienceYears} Tahun</div>
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-stone-200/70">
                  <div className="text-stone-600 text-[10px]">Jam Terbang</div>
                  <div className="font-bold text-emerald-700">{therapist.totalHours}+ Jam</div>
                </div>
              </div>

              {/* Specialties & Bio */}
              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Keahlian & Spesialisasi:</div>
                  <div className="flex flex-wrap gap-1">
                    {(therapist.specialties || []).map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Sertifikasi Resmi:</div>
                  <div className="space-y-1 text-xs">
                    {therapist.certifications.slice(0, 1).map((cert, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{cert.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0">
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
                <button
                  onClick={() => setViewingTherapist(therapist)}
                  className="py-2 px-3 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
                >
                  Lihat Profil
                </button>
                <button
                  onClick={() => handleBookTherapist(therapist)}
                  className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95"
                >
                  Pilih Terapis
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredTherapists.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 text-sm">Tidak ditemukan terapis dengan filter pencarian tersebut.</p>
        </div>
      )}

      {/* Partner Registration Modal */}
      <TherapistRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
