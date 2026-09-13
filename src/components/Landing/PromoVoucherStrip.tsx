import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Gift, Ticket } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const PromoVoucherStrip: React.FC = () => {
  const { vouchers, setIsBookingModalOpen, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Kode promo ${code} berhasil disalin!`, 'success');
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleUseCode = (code: string) => {
    handleCopyCode(code);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Limited Time Offers</span>
          </div>
          <h2 className="text-3xl font-bold font-serif-display text-stone-900">Penawaran Eksklusif</h2>
          <p className="text-stone-500 max-w-xl text-sm leading-relaxed">
            Nikmati kemewahan spa di rumah dengan harga lebih terjangkau. Gunakan kode promo khusus pelanggan setia kami.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vouchers.map((v) => {
          const isCopied = copiedCode === v.code;
          return (
            <div
              key={v.code}
              className="group relative bg-white rounded-3xl p-6 border border-stone-100 shadow-soft hover:shadow-premium transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-50" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-emerald-700 leading-none mb-1">
                      {v.discountAmount ? formatRupiah(v.discountAmount) : `${v.discountPercent}%`}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Potongan Langsung</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <h3 className="font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">{v.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{v.description}</p>
                </div>

                <div className="flex items-center gap-2 p-1 pl-4 rounded-2xl bg-stone-50 border border-stone-100 group-hover:border-emerald-200 group-hover:bg-emerald-50/50 transition-all">
                  <span className="flex-1 font-mono text-sm font-bold text-stone-700 tracking-wider">
                    {v.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(v.code)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      isCopied 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-100 shadow-sm'
                    }`}
                  >
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-dashed border-stone-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-tight">Min. Belanja</span>
                  <span className="text-xs font-bold text-stone-700">{formatRupiah(v.minOrder)}</span>
                </div>
                <button
                  onClick={() => handleUseCode(v.code)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-700/10 active:scale-95"
                >
                  Gunakan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
