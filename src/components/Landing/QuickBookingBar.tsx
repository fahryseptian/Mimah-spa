import React from 'react';
import { 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Zap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickBookingBar: React.FC = () => {
  const { setIsBookingModalOpen, selectedRadiusKm } = useApp();

  return (
    <div className="relative group max-w-4xl">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-white border border-stone-100 p-2 sm:p-3 rounded-[2rem] shadow-premium flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        
        {/* Step 1: Location Radius */}
        <div 
          onClick={() => setIsBookingModalOpen(true)}
          className="flex-1 flex items-center gap-4 px-6 py-3 rounded-2xl bg-stone-50/50 border border-transparent hover:border-emerald-100 hover:bg-emerald-50/30 transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center shadow-xs">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1.5">Jarak Radius Medan</p>
            <p className="text-sm font-bold text-stone-900 leading-none">Radius ~ {selectedRadiusKm} KM Medan</p>
          </div>
        </div>

        {/* Divider (Desktop) */}
        <div className="hidden sm:block w-px h-10 bg-stone-100 mx-1" />

        {/* Step 2: Instant Benefit */}
        <div className="flex-1 flex items-center gap-4 px-6 py-3 rounded-2xl border border-transparent hover:border-amber-100 hover:bg-amber-50/20 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mb-1.5">Benefit Instan</p>
            <p className="text-sm font-bold text-stone-900 leading-none truncate">Free Transport 3KM</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="sm:ml-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-[1.5rem] font-bold text-sm shadow-lg shadow-emerald-700/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
        >
          <span>Pesan Sekarang</span>
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Floating Trust Badge */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 whitespace-nowrap bg-white px-4 py-2 rounded-full shadow-soft border border-stone-100 scale-90 sm:scale-100">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Terapis Bersertifikat</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-stone-200" />
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Rating 4.9/5</span>
        </div>
      </div>
    </div>
  );
};
