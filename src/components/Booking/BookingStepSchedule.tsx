import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { PlaceType } from '../../types';
import { LocationPickerMap } from './LocationPickerMap';
import { formatRupiah } from '../../utils/formatters';

interface Props {
  bookingDate: string;
  setBookingDate: (d: string) => void;
  customDate: string;
  setCustomDate: (d: string) => void;
  timeSlot: string;
  setTimeSlot: (t: string) => void;
  address: string;
  setAddress: (a: string) => void;
  clientKecamatan: string;
  setClientKecamatan: (k: string) => void;
  distanceKm: number;
  setDistanceKm: (d: number) => void;
  placeType: PlaceType;
  setPlaceType: (p: PlaceType) => void;
  addressNotes: string;
  setAddressNotes: (n: string) => void;
  transportCost: number;
  originKecamatan?: string;
  therapistName?: string;
}

export const BookingStepSchedule: React.FC<Props> = (props) => {
  const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  
  const currentHour = new Date().getHours();
  
  const availableSlots = allSlots.filter(slot => {
    if (props.bookingDate === 'Hari Ini') {
      const slotHour = parseInt(slot.split(':')[0], 10);
      return slotHour > currentHour; // Only future hours today
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Pilih Hari Layanan</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['Hari Ini', 'Besok', 'Pilih Tanggal'].map((d) => (
              <button
                key={d}
                onClick={() => props.setBookingDate(d)}
                className={`py-2 px-1 text-xs rounded-xl border text-center font-medium transition-colors ${
                  props.bookingDate === d
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-stone-100 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          {props.bookingDate === 'Pilih Tanggal' && (
            <input
              type="date"
              value={props.customDate}
              onChange={(e) => props.setCustomDate(e.target.value)}
              className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Jam Pelayanan Tersedia (WIB)</span>
          </label>
          {availableSlots.length === 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium text-center">
              Waktu hari ini sudah habis. Silakan pilih <b>Besok</b> atau <b>Pilih Tanggal</b>.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {availableSlots.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => props.setTimeSlot(t)}
                  className={`py-2 px-1 text-xs rounded-xl border text-center font-bold transition-all ${
                    props.timeSlot === t
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-900/10'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <LocationPickerMap
        initialAddress={props.address}
        initialKecamatan={props.clientKecamatan}
        originKecamatan={props.originKecamatan}
        therapistName={props.therapistName}
        onLocationSelect={(selectedAddr, selectedKec, calcDist) => {
          if (selectedAddr) props.setAddress(selectedAddr);
          if (selectedKec) props.setClientKecamatan(selectedKec);
          if (calcDist) props.setDistanceKm(calcDist);
        }}
      />

      <div className="p-4 bg-emerald-50/50 text-stone-900 rounded-2xl space-y-2 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Jarak Otomatis dari Pos {props.therapistName ? props.therapistName.split(',')[0] : 'Terapis'} ({props.originKecamatan || 'Medan Baru'}):</span>
          </div>
          <div className="text-sm font-black text-emerald-900 bg-emerald-200/60 px-3 py-1 rounded-xl">{props.distanceKm} KM</div>
        </div>
        <p className="text-[11px] text-stone-500">
          *Jarak dihitung secara otomatis dan transparan berdasarkan titik koordinat lokasi / alamat tujuan Anda di Medan.
        </p>
        <div className="flex justify-between items-center text-xs pt-2 border-t border-emerald-200/50">
          <span className="text-stone-600 font-medium">Biaya Transportasi:</span>
          <span className="text-base font-extrabold text-emerald-700">
            {formatRupiah(props.transportCost)}
          </span>
        </div>
      </div>
    </div>
  );
};
