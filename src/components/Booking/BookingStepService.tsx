import React from 'react';
import { ServiceItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  services: ServiceItem[];
  selectedService: ServiceItem;
  setSelectedService: (s: ServiceItem) => void;
  selectedDuration: number;
  setSelectedDuration: (d: number) => void;
}

export const BookingStepService: React.FC<Props> = ({
  services,
  selectedService,
  setSelectedService,
  selectedDuration,
  setSelectedDuration,
}) => {
  return (
    <div className="space-y-6">
      {/* Service Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Pilih Menu Layanan Utama:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {services.map((s) => {
            const sDurationOpts = (s.durationOptions && s.durationOptions.length > 0)
              ? s.durationOptions
              : [{ durationMinutes: 90, price: 135000, popular: true }];
            const startingPrice = sDurationOpts[0]?.price || 100000;
            const defaultDur = sDurationOpts[0]?.durationMinutes || 90;

            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedService(s);
                  setSelectedDuration(defaultDur);
                }}
                className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                  selectedService.id === s.id
                    ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600 font-semibold'
                    : 'border-stone-100 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900">{s.title}</div>
                  <div className="text-[11px] text-stone-500 line-clamp-1">{s.tagline}</div>
                  <div className="text-[11px] font-semibold text-emerald-800">Mulai {formatRupiah(startingPrice)}</div>
                </div>
                {selectedService.id === s.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Pilih Durasi Waktu:
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {((selectedService.durationOptions && selectedService.durationOptions.length > 0)
            ? selectedService.durationOptions
            : [{ durationMinutes: 90, price: 135000, popular: true }]
          ).map((opt) => (
            <button
              key={opt.durationMinutes}
              onClick={() => setSelectedDuration(opt.durationMinutes)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedDuration === opt.durationMinutes
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                  : 'border-stone-100 hover:border-stone-300 text-stone-700'
              }`}
            >
              <div className="text-sm font-bold">{opt.durationMinutes} Menit</div>
              <div className="text-xs font-extrabold text-emerald-700 mt-1">{formatRupiah(opt.price)}</div>
              {opt.popular && (
                <span className="inline-block mt-1 text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                  PALING DIMINATI
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
