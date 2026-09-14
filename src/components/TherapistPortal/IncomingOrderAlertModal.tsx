import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BellRing, 
  Clock, 
  MapPin, 
  Sparkles, 
  Check, 
  X, 
  AlertTriangle,
  Volume2,
  VolumeX,
  Car
} from 'lucide-react';
import { BookingItem, Therapist } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { soundFx } from '../../utils/audioAlert';

interface IncomingOrderAlertModalProps {
  order: BookingItem | null;
  therapist: Therapist;
  isOpen: boolean;
  onAccept: (order: BookingItem) => void;
  onDecline: (order: BookingItem, reason: string) => void;
  onClose: () => void;
}

export const IncomingOrderAlertModal: React.FC<IncomingOrderAlertModalProps> = ({
  order,
  therapist,
  isOpen,
  onAccept,
  onDecline,
  onClose
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [declineReason, setDeclineReason] = useState<string>('');
  const [showDeclineForm, setShowDeclineForm] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !order) {
      setSecondsLeft(60);
      setShowDeclineForm(false);
      return;
    }

    // Play initial ringtone chime
    if (!isMuted) {
      soundFx.playIncomingOrderChime();
    }

    // Interval to ring every 6 seconds while alert is active
    const chimeInterval = setInterval(() => {
      if (!isMuted && !showDeclineForm) {
        soundFx.playIncomingOrderChime();
      }
    }, 6000);

    // 1-second countdown
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          clearInterval(chimeInterval);
          onDecline(order, 'Waktu respon habis (Auto-timeout)');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
      clearInterval(chimeInterval);
    };
  }, [isOpen, order, isMuted, showDeclineForm]);

  if (!isOpen || !order) return null;

  const therapistCommission = Math.round(order.servicePrice * therapist.commissionRate) + order.transportCost;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-lg bg-stone-900 text-white rounded-[3rem] p-8 border-2 border-emerald-500/40 shadow-2xl overflow-hidden z-10"
        >
          {/* Pulsing ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none animate-pulse" />
          
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute -inset-2 bg-emerald-500 rounded-2xl blur-lg opacity-60 animate-ping" />
                <div className="relative w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <BellRing className="w-6 h-6 animate-bounce" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Pesanan Masuk Baru</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-mono font-bold">
                    {secondsLeft}s
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif-display text-white">Konfirmasi Tugas Mitra</h3>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-stone-400 hover:text-white transition-all"
              title={isMuted ? 'Nyalakan Nada Dering' : 'Matikan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Countdown Progress Bar */}
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mb-6">
            <motion.div
              className={`h-full ${secondsLeft > 15 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}
              initial={{ width: '100%' }}
              animate={{ width: `${(secondsLeft / 60) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>

          {!showDeclineForm ? (
            <div className="space-y-6 relative z-10">
              {/* Service & Commission Box */}
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Layanan Diminta</div>
                  <h4 className="text-lg font-bold text-white font-serif-display">{order.serviceTitle}</h4>
                  <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> {order.durationMinutes} Menit</span>
                    <span>•</span>
                    <span>{order.bookingTimeSlot} WIB</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Potensi Pendapatan</div>
                  <div className="text-2xl font-black text-emerald-400">{formatRupiah(therapistCommission)}</div>
                  <div className="text-[9px] text-stone-400">Komisi + Ongkir</div>
                </div>
              </div>

              {/* Location Box */}
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Lokasi Klien ({order.estimatedDistanceKm} km)</div>
                    <div className="text-sm font-bold text-white">{order.customerName}</div>
                    <p className="text-xs text-stone-300 leading-relaxed mt-0.5">{order.address}, {order.kecamatan}, {order.city}</p>
                    {order.addressNotes && (
                      <p className="text-[11px] text-emerald-300/80 italic mt-1">"Patokan: {order.addressNotes}"</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-emerald-400" /> Estimasi Perjalanan: ~15-20 Menit</span>
                  <span className="font-mono text-[10px] text-stone-400">ID: #{order.bookingCode}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeclineForm(true)}
                  className="py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <X className="w-4 h-4 text-stone-400" />
                  Tolak
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundFx.playSuccessChime();
                    onAccept(order);
                  }}
                  className="py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all font-sans"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Terima Pesanan
                </motion.button>
              </div>
            </div>
          ) : (
            /* Decline Reason Subform */
            <div className="space-y-5 relative z-10">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Pilih Alasan Menolak Tugas:</span>
              </div>

              <div className="space-y-2">
                {[
                  'Kendaraan bermasalah / ban bocor',
                  'Kapasitas jadwal penuh / sedang melayani',
                  'Lokasi penjemputan terlalu jauh dari titik saat ini',
                  'Keperluan mendesak / istirahat darurat'
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setDeclineReason(reason)}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs font-medium border transition-all ${
                      declineReason === reason
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeclineForm(false)}
                  className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-stone-400 text-xs font-bold"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={!declineReason}
                  onClick={() => onDecline(order, declineReason)}
                  className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
