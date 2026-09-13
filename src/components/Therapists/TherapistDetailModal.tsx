import React from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MessageSquare,
  PackageCheck,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Therapist } from '../../types';

export const TherapistDetailModal: React.FC = () => {
  const { 
    viewingTherapist, 
    setViewingTherapist, 
    reviews, 
    setSelectedTherapistForBooking, 
    setIsBookingModalOpen 
  } = useApp();

  if (!viewingTherapist) return null;

  const therapistReviews = reviews.filter(r => r.therapistId === viewingTherapist.id);

  const handleBook = () => {
    setSelectedTherapistForBooking(viewingTherapist);
    setViewingTherapist(null);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-soft-hover border border-stone-200">
        
        {/* Header Cover */}
        <div className="relative bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 sm:p-8 rounded-t-3xl">
          <button
            onClick={() => setViewingTherapist(null)}
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={viewingTherapist.photoUrl}
              alt={viewingTherapist.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-white/80 shadow-soft"
            />
            
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold font-serif-display">{viewingTherapist.name}</h2>
                {viewingTherapist.isTopTherapist && (
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-amber-950 text-xs font-bold">
                    Top Rated Terapis
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-emerald-800">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  {viewingTherapist.rating} ({viewingTherapist.reviewCount} Ulasan)
                </span>
                <span>•</span>
                <span>{viewingTherapist.age} Tahun</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {viewingTherapist.baseKecamatan}, {viewingTherapist.baseCity}
                </span>
              </div>

              <p className="text-xs text-emerald-900/90 pt-1 line-clamp-2">
                {viewingTherapist.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-stone-700">
          
          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <div>
              <div className="text-[11px] text-stone-600">Pengalaman</div>
              <div className="text-base font-bold text-stone-900">{viewingTherapist.experienceYears} Tahun</div>
            </div>
            <div className="border-x border-stone-200">
              <div className="text-[11px] text-stone-600">Total Jam Terbang</div>
              <div className="text-base font-bold text-emerald-700">{viewingTherapist.totalHours}+ Jam</div>
            </div>
            <div>
              <div className="text-[11px] text-stone-600">Order Sukses</div>
              <div className="text-base font-bold text-stone-900">{viewingTherapist.completedOrders}+ Klien</div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Sertifikasi Resmi & Uji Kompetensi</span>
            </h3>
            <div className="space-y-2">
              {viewingTherapist.certifications.map((cert, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-emerald-950">{cert.name}</div>
                    <div className="text-[11px] text-emerald-800">{cert.issuer} • Lulus {cert.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Carried */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>Standar Perlengkapan Koper Steril yang Dibawa</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {viewingTherapist.equipmentProvided.map((eq, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-stone-700 text-[11px]">{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Area */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-600">Area Cakupan Panggilan:</div>
            <div className="flex flex-wrap gap-1.5">
              {viewingTherapist.operationalCities.map((c, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium">
                  📍 {c}
                </span>
              ))}
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Ulasan Klien Terverifikasi</span>
              </span>
              <span className="text-stone-600 font-normal">{therapistReviews.length} Ulasan</span>
            </h3>

            <div className="space-y-3 max-h-48 overflow-y-auto">
              {therapistReviews.length > 0 ? (
                therapistReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{rev.customerName} ({rev.customerCity})</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium">{rev.serviceTitle}</div>
                    <p className="text-stone-600 text-[11px] italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-500">
                  Belum ada ulasan untuk terapis ini. Jadilah yang pertama memberikan review!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 rounded-b-3xl flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] text-stone-600 uppercase font-semibold">Status Kesiapan</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Siap Melayani Booking Panggilan</span>
            </div>
          </div>

          <button
            onClick={handleBook}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-soft shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Pesan dengan Terapis Ini</span>
          </button>
        </div>

      </div>
    </div>
  );
};
