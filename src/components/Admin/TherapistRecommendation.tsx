import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Zap, 
  X,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingItem } from '../../types';
import { getRecommendedTherapists, RecommendedTherapist } from '../../utils/recommendationEngine';

interface TherapistRecommendationProps {
  booking: BookingItem;
  isOpen: boolean;
  onClose: () => void;
}

export const TherapistRecommendation: React.FC<TherapistRecommendationProps> = ({ 
  booking, 
  isOpen, 
  onClose 
}) => {
  const { therapists, assignTherapist } = useApp();

  const recommendations = useMemo(() => {
    if (!isOpen) return [];
    return getRecommendedTherapists(booking, therapists);
  }, [isOpen, booking, therapists]);

  const handleAssign = (therapist: RecommendedTherapist) => {
    assignTherapist(booking.id, therapist);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
                  <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-serif-display text-stone-900">Smart Match</h3>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Rekomendasi Terapis Terdekat</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-200 rounded-xl transition-all text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Summary */}
            <div className="p-6 bg-emerald-50/50 border-b border-emerald-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[10px] font-black text-emerald-800/60 uppercase tracking-widest mb-1">Lokasi Pelanggan</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {booking.kecamatan}, {booking.city}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-emerald-800/60 uppercase tracking-widest mb-1">Layanan</div>
                  <div className="text-sm font-bold text-stone-900">{booking.serviceTitle}</div>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 leading-relaxed italic">
                Sistem menganalisis lokasi, ketersediaan, rating, dan spesialisasi secara real-time.
              </div>
            </div>

            {/* Recommendations List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {recommendations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-stone-50 rounded-3xl flex items-center justify-center mb-4">
                    <UserPlus className="w-8 h-8 text-stone-200" />
                  </div>
                  <h4 className="text-stone-900 font-bold mb-1">Tidak Ada Terapis Tersedia</h4>
                  <p className="text-xs text-stone-500">Coba ubah filter atau tunggu beberapa saat sampai mitra kami online.</p>
                </div>
              ) : (
                recommendations.map((therapist, idx) => (
                  <motion.div
                    key={therapist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative p-4 bg-white border border-stone-100 rounded-3xl hover:border-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-900/5 cursor-pointer"
                    onClick={() => handleAssign(therapist)}
                  >
                    {/* Best Match Badge */}
                    {idx === 0 && (
                      <div className="absolute -top-2 -right-2 px-3 py-1 bg-stone-900 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 z-10">
                        <Award className="w-3 h-3 text-amber-400" />
                        Best Match
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="relative">
                        <img 
                          src={therapist.photoUrl} 
                          alt={therapist.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-50"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-stone-900 leading-tight pr-8">{therapist.name}</h4>
                          <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {therapist.rating}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500">
                            <MapPin className="w-3 h-3" />
                            {therapist.baseKecamatan}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500">
                            <Clock className="w-3 h-3" />
                            {therapist.experienceYears} Thn
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {therapist.matchReasons.slice(0, 2).map((reason, rIdx) => (
                            <span 
                              key={rIdx}
                              className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-tight rounded-full border border-emerald-100"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="p-2 rounded-xl bg-stone-50 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Score Bar */}
                    <div className="mt-4 h-1 bg-stone-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((therapist.matchScore / 250) * 100, 100)}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-100 bg-stone-50/50">
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-stone-200">
                <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-stone-900 uppercase mb-1">Optimasi Logistik</p>
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Menugaskan terapis terdekat membantu mengurangi waktu tunggu pelanggan dan biaya operasional mitra.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
