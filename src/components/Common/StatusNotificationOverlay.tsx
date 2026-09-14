import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  User, 
  Sparkles, 
  BellRing,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingStatus } from '../../types';

export const StatusNotificationOverlay: React.FC = () => {
  const { lastStatusUpdate, clearLastStatusUpdate } = useApp();

  useEffect(() => {
    if (lastStatusUpdate) {
      const timer = setTimeout(() => {
        clearLastStatusUpdate();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [lastStatusUpdate, clearLastStatusUpdate]);

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: ShieldCheck,
          color: 'bg-blue-500',
          title: 'Pesanan Dikonfirmasi',
          desc: 'Admin telah menyetujui pesanan Anda dan menugaskan mitra terapis terbaik.',
          accent: 'blue'
        };
      case 'therapist_on_the_way':
        return {
          icon: MapPin,
          color: 'bg-amber-500',
          title: 'Terapis Menuju Lokasi',
          desc: 'Mitra kami sudah berangkat! Siapkan diri Anda untuk relaksasi yang luar biasa.',
          accent: 'amber'
        };
      case 'therapist_arrived':
        return {
          icon: User,
          color: 'bg-indigo-500',
          title: 'Terapis Telah Sampai',
          desc: 'Terapis sudah berada di depan lokasi. Harap berikan akses masuk atau sambut mitra kami.',
          accent: 'indigo'
        };
      case 'in_session':
        return {
          icon: Clock,
          color: 'bg-emerald-500',
          title: 'Sesi Dimulai',
          desc: 'Sesi perawatan sedang berlangsung. Selamat menikmati waktu "Me Time" Anda.',
          accent: 'emerald'
        };
      case 'completed':
        return {
          icon: Sparkles,
          color: 'bg-purple-500',
          title: 'Layanan Selesai',
          desc: 'Terima kasih telah mempercayakan kesehatan Anda pada Mimah Spa. Sampai jumpa kembali!',
          accent: 'purple'
        };
      case 'cancelled':
        return {
          icon: X,
          color: 'bg-rose-500',
          title: 'Pesanan Dibatalkan',
          desc: 'Status pesanan Anda telah diperbarui menjadi dibatalkan.',
          accent: 'rose'
        };
      default:
        return {
          icon: BellRing,
          color: 'bg-stone-500',
          title: 'Update Status',
          desc: 'Ada perubahan pada status layanan Anda.',
          accent: 'stone'
        };
    }
  };

  return (
    <AnimatePresence>
      {lastStatusUpdate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={clearLastStatusUpdate}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />

          {/* Modal Overlay */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-stone-900/20 border border-white"
          >
            {/* Top Branding Section */}
            <div className={`p-8 ${getStatusConfig(lastStatusUpdate.status).color} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-black/10 rounded-full blur-xl" />
              
              <div className="relative z-10 flex flex-col items-center text-center text-white">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center mb-4 border border-white/20 shadow-inner">
                  {React.createElement(getStatusConfig(lastStatusUpdate.status).icon, { className: "w-10 h-10" })}
                </div>
                <h3 className="text-2xl font-black tracking-tight leading-tight mb-1">
                  {getStatusConfig(lastStatusUpdate.status).title}
                </h3>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                  Status Transisi Berhasil
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-stone-100 rounded-full text-[9px] font-black text-stone-500 uppercase tracking-widest border border-stone-200">
                  Kode: {lastStatusUpdate.bookingCode}
                </div>
                <div className="h-px flex-1 bg-stone-100" />
              </div>

              <p className="text-sm text-stone-600 leading-relaxed font-medium mb-8">
                {getStatusConfig(lastStatusUpdate.status).desc}
              </p>

              <button
                onClick={clearLastStatusUpdate}
                className={`w-full py-4 rounded-2xl bg-stone-900 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-stone-800 active:scale-[0.98] shadow-lg shadow-stone-900/20`}
              >
                <span>Siap, Saya Mengerti</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-6 flex justify-center">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-stone-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
