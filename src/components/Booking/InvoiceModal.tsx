import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Send,
  Building,
  ReceiptText
} from 'lucide-react';
import { BookingItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface InvoiceModalProps {
  booking: BookingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const message = 
`🧾 *E-RECEIPT RESMI MIMAH SPA MEDAN*
---------------------------------------
No. Transaksi: *#${booking.bookingCode}*
Tanggal: ${booking.bookingDate} (${booking.bookingTimeSlot} WIB)
Pelanggan: ${booking.customerName} (${booking.customerPhone})
Alamat: ${booking.address}, ${booking.kecamatan}, ${booking.city}

*RINCIAN LAYANAN:*
• ${booking.serviceTitle} (${booking.durationMinutes} mnt): ${formatRupiah(booking.servicePrice)}
${booking.selectedAddOns?.map(a => `• Add-on: ${a.name}: ${formatRupiah(a.price)}`).join('\n') || ''}
• Ongkos Antar (${booking.estimatedDistanceKm} km): ${formatRupiah(booking.transportCost)}
${booking.discountAmount > 0 ? `• Diskon Voucher (${booking.voucherCode || 'PROMO'}): -${formatRupiah(booking.discountAmount)}` : ''}

*TOTAL PEMBAYARAN:* *${formatRupiah(booking.totalAmount)}*
Metode: ${booking.paymentMethod.toUpperCase()}
Status: ${booking.paymentStatus === 'paid' ? 'LUNAS (PAID)' : 'MENUNGGU PEMBAYARAN'}

Mitra Terapis: ${booking.therapistName || 'Terapis Mimah Spa'}
Terima kasih telah mempercayakan kebugaran Anda pada Mimah Spa! 🌿`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 overflow-hidden my-8 z-10 print:m-0 print:border-none print:shadow-none"
        >
          {/* Top Bar - Screen only */}
          <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-50 print:hidden">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow-sm">
                <ReceiptText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900 font-serif-display">E-Receipt Resmi</h3>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Mimah Spa Home & Hotel Care</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2.5 hover:bg-stone-200 text-stone-600 rounded-xl transition-all"
                title="Cetak Faktur"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="p-2.5 hover:bg-emerald-50 text-emerald-700 rounded-xl transition-all"
                title="Bagikan ke WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-stone-200 text-stone-400 hover:text-stone-700 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="p-8 sm:p-10 space-y-8 print:p-6 bg-white" id="printable-receipt">
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-6">
              <div className="space-y-1">
                <div className="text-2xl font-black font-serif-display tracking-tight text-stone-900">
                  MIMAH SPA
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  Layanan Pijat & Terapi Panggilan Medan
                </div>
                <div className="text-xs text-stone-400 font-medium">
                  Jl. Kapten Muslim No. 88, Medan Helvetia • WA: +62 812-3456-789
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  booking.paymentStatus === 'paid' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {booking.paymentStatus === 'paid' ? 'LUNAS (PAID)' : 'MENUNGGU PEMBAYARAN'}
                </span>
                <div className="text-xs font-mono font-bold text-stone-700">
                  #{booking.bookingCode}
                </div>
              </div>
            </div>

            {/* Customer & Booking Meta Info */}
            <div className="grid grid-cols-2 gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
              <div className="space-y-1">
                <div className="text-[9px] font-black uppercase tracking-widest text-stone-400">Klien / Pemesan</div>
                <div className="font-bold text-stone-900">{booking.customerName}</div>
                <div className="text-stone-500 font-mono text-[11px]">{booking.customerPhone}</div>
                <div className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                  {booking.address}, {booking.kecamatan}, {booking.city}
                </div>
              </div>

              <div className="space-y-1 text-right sm:text-left sm:pl-4 sm:border-l sm:border-stone-200">
                <div className="text-[9px] font-black uppercase tracking-widest text-stone-400">Jadwal Reservasi</div>
                <div className="font-bold text-stone-900 flex items-center gap-1 sm:justify-start justify-end">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {booking.bookingDate}
                </div>
                <div className="text-stone-600 flex items-center gap-1 sm:justify-start justify-end font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {booking.bookingTimeSlot} WIB ({booking.durationMinutes} Menit)
                </div>
                <div className="text-[11px] text-emerald-800 font-bold mt-1">
                  Terapis: {booking.therapistName || 'Mitra Penanggung Jawab'}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">Rincian Transaksi</div>
              <div className="border border-stone-200/80 rounded-2xl overflow-hidden divide-y divide-stone-100">
                
                {/* Service Item */}
                <div className="p-4 flex items-center justify-between bg-white text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{booking.serviceTitle}</div>
                    <div className="text-[10px] text-stone-400">
                      Durasi {booking.durationMinutes} Menit • {booking.selectedOil || 'Minyak Lavender'} • {booking.pressureLevel}
                    </div>
                  </div>
                  <div className="font-bold text-stone-900">{formatRupiah(booking.servicePrice)}</div>
                </div>

                {/* Addons */}
                {booking.selectedAddOns?.map((addon, i) => (
                  <div key={i} className="p-4 flex items-center justify-between bg-white text-xs">
                    <div>
                      <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {addon.name}
                      </div>
                      <div className="text-[10px] text-stone-400">Tambahan Perawatan Khusus</div>
                    </div>
                    <div className="font-semibold text-stone-800">+{formatRupiah(addon.price)}</div>
                  </div>
                ))}

                {/* Transport fee */}
                <div className="p-4 flex items-center justify-between bg-white text-xs">
                  <div>
                    <div className="font-medium text-stone-700">Biaya Transportasi Mitra</div>
                    <div className="text-[10px] text-stone-400">Jarak tempuh estimasi {booking.estimatedDistanceKm} km</div>
                  </div>
                  <div className="font-medium text-stone-900">
                    {formatRupiah(booking.transportCost)}
                  </div>
                </div>

                {/* Voucher Discount */}
                {booking.discountAmount > 0 && (
                  <div className="p-4 flex items-center justify-between bg-emerald-50/50 text-xs">
                    <div>
                      <div className="font-bold text-emerald-800">Potongan Diskon Voucher</div>
                      <div className="text-[10px] text-emerald-600 font-mono">Kode: {booking.voucherCode || 'PROMO'}</div>
                    </div>
                    <div className="font-bold text-emerald-800">-{formatRupiah(booking.discountAmount)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Total Section */}
            <div className="pt-2 border-t border-dashed border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Metode Pembayaran</span>
                <span className="font-bold uppercase text-stone-800">{booking.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Akhir</span>
                <span className="text-2xl text-emerald-800 tracking-tight">{formatRupiah(booking.totalAmount)}</span>
              </div>
            </div>

            {/* Terms / Footer Notes */}
            <div className="p-4 bg-stone-50 rounded-2xl text-[10px] text-stone-500 space-y-1 text-center font-medium leading-relaxed">
              <p>Faktur ini diterbitkan secara elektronik dan sah sebagai bukti pembayaran resmi Mimah Spa.</p>
              <p>Semua terapis kami terikat kode etik kebersihan, privasi, dan standar profesional.</p>
            </div>
          </div>

          {/* Action Buttons Footer - Screen only */}
          <div className="p-6 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3 print:hidden">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all"
            >
              <Send className="w-4 h-4" />
              Kirim ke WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="py-3 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              Cetak / PDF
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
