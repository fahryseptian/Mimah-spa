import React from 'react';
import { ServiceAddOn as AddOn } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { Check } from 'lucide-react';

interface Props {
  addOns: AddOn[];
  selectedAddOnIds: string[];
  handleToggleAddOn: (id: string) => void;
}

export const BookingStepAddOns: React.FC<Props> = ({
  addOns,
  selectedAddOnIds,
  handleToggleAddOn,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-stone-900">Perawatan Tambahan Tradisional</h3>
        <p className="text-xs text-stone-500">
          Terapis membawa peralatan steril untuk add-on yang dipilih.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addOns.map((add) => {
          const isChecked = selectedAddOnIds.includes(add.id);
          return (
            <div
              key={add.id}
              onClick={() => handleToggleAddOn(add.id)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isChecked
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                  : 'border-stone-100 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-stone-900">{add.name}</h4>
                  <span className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3 h-3" />}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">{add.description}</p>
              </div>

              <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">+{add.durationMinutes} Menit</span>
                <span className="font-bold text-emerald-800">+{formatRupiah(add.price)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
