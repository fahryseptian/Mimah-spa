import React, { useState } from 'react';
import { 
  Calculator, 
  MapPin, 
  Navigation, 
  Clock, 
  CloudRain, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronRight,
  Info,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, calculateTransportFare } from '../../utils/formatters';
import { PlaceType, MEDAN_RADIUS_OPTIONS } from '../../types';

export const TransportCalculator: React.FC = () => {
  const { 
    selectedCity, 
    tariffConfig, 
    setIsBookingModalOpen,
    setSelectedKecamatan,
    selectedKecamatan,
    selectedRadiusKm,
    setSelectedRadiusKm
  } = useApp();

  const [distanceKm, setDistanceKm] = useState<number>(3.5);
  const [timeSlot, setTimeSlot] = useState<string>('14:00');
  const [isRainy, setIsRainy] = useState<boolean>(false);
  const [placeType, setPlaceType] = useState<PlaceType>('rumah');

  const breakdown = calculateTransportFare(distanceKm, timeSlot, isRainy, placeType, tariffConfig);

  const presetRoutes = [
    { label: 'Dekat / Area Tetangga (1.5 km)', km: 1.5, desc: 'Bebas Ongkir Promo!' },
    { label: 'Jarak Standar Kota (4.2 km)', km: 4.2, desc: 'Rute umum perkotaan' },
    { label: 'Jarak Menengah Antar-Kecamatan (8.0 km)', km: 8.0, desc: 'Radius 5-10 km' },
    { label: 'Jarak Jauh Pinggiran (15.0 km)', km: 15.0, desc: 'Area luar batas kota' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kalkulator Transparan Mimah Spa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-display">
            Simulasi & Estimasi Biaya Transportasi Terapis
          </h2>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Terapis Mimah Spa datang langsung menggunakan sepeda motor pribadi dengan koper perlengkapan steril. Hitung tarif ongkir jujur tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Free promo highlight */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl p-3.5 flex items-center gap-3 shadow-soft shrink-0">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
            3KM
          </div>
          <div className="text-xs">
            <div className="font-bold text-emerald-900">PROMO RADIUS DEKAT</div>
            <div className="text-emerald-800">0 s/d 3 KM Bebas Biaya Transport</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Radius Selection Cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Pilih Tier Radius Layanan Medan</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MEDAN_RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.km}
                  onClick={() => {
                    setSelectedRadiusKm(opt.km);
                    setDistanceKm(opt.km);
                  }}
                  className={`p-3 text-xs rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    distanceKm === opt.km || selectedRadiusKm === opt.km
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs' 
                      : 'border-stone-200 hover:border-emerald-200 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500 font-medium">{opt.description}</div>
                  </div>
                  {(distanceKm === opt.km || selectedRadiusKm === opt.km) && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Distance Slider */}
          <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Estimasi Jarak dari Pos Terapis</span>
              </label>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-emerald-700">{distanceKm}</span>
                <span className="text-xs font-bold text-stone-500 ml-1">KM</span>
              </div>
            </div>

            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-[11px] text-stone-600 font-medium">
              <span>0.5 km (Sangat Dekat)</span>
              <span>10 km (Radius Normal)</span>
              <span>25 km (Batas Maksimal)</span>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-stone-500 mb-1.5">Contoh Preset Rute:</div>
              <div className="grid grid-cols-2 gap-1.5">
                {presetRoutes.map((p) => (
                  <button
                    key={p.km}
                    onClick={() => setDistanceKm(p.km)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] border text-left transition-colors ${
                      distanceKm === p.km 
                        ? 'bg-emerald-600 text-white border-emerald-600 font-medium' 
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <div className="font-semibold">{p.km} KM</div>
                    <div className={distanceKm === p.km ? 'text-emerald-900' : 'text-stone-600'}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Place Type & Surcharge Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Place Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Tipe Tempat</span>
              </label>
              <select
                value={placeType}
                onChange={(e) => setPlaceType(e.target.value as PlaceType)}
                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              >
                <option value="rumah">Rumah Tinggal / Hunian Mandiri ({formatRupiah(0)})</option>
                <option value="kos">Kos-kosan / Paviliun ({formatRupiah(0)})</option>
                <option value="apartemen">Apartemen / Kondominium (+{formatRupiah(5000)} parkir/akses)</option>
                <option value="hotel">Hotel / Penginapan (+{formatRupiah(5000)} parkir/akses)</option>
                <option value="kantor">Kantor / Studio (+{formatRupiah(5000)} parkir/akses)</option>
              </select>
            </div>

            {/* Time of Service */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Jam Pelayanan</span>
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              >
                <option value="09:00">Pagi (09:00 WIB) - Standar</option>
                <option value="12:00">Siang (12:00 WIB) - Standar</option>
                <option value="15:00">Sore (15:00 WIB) - Standar</option>
                <option value="18:00">Malam (18:00 WIB) - Standar</option>
                <option value="20:00">Malam (20:00 WIB) - Standar</option>
              </select>
            </div>

          </div>

          {/* Weather Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-950">Kondisi Hujan Deras / Cuaca Ekstrem</div>
                <div className="text-[11px] text-amber-700">Insentif keselamatan terapis berkendara jas hujan (+{formatRupiah(10000)})</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isRainy} 
                onChange={(e) => setIsRainy(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

        </div>

        {/* Right Calculation Receipt (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white text-stone-800 rounded-2xl p-6 shadow-xl border border-stone-100 flex flex-col justify-between h-full space-y-6">
            
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rincian Biaya Transport</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-stone-800 text-stone-500">
                  {selectedCity}
                </span>
              </div>

              {/* Breakdown Lines */}
              <div className="space-y-3 mt-4 text-xs">
                
                <div className="flex justify-between items-center text-stone-500">
                  <span>Tarif Dasar Minimal (&le; 3 KM):</span>
                  <span>{formatRupiah(breakdown.base)}</span>
                </div>

                {distanceKm > 3 && breakdown.distanceFare > 0 && (
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Jarak Tambahan ({(distanceKm - 3).toFixed(1)} km &times; {formatRupiah(tariffConfig.perKmFare)}):</span>
                    <span>+{formatRupiah(breakdown.distanceFare)}</span>
                  </div>
                )}

                {breakdown.nightSurcharge > 0 && (
                  <div className="flex justify-between items-center text-amber-300">
                    <span>🌙 Surcharge Jam Malam (&gt; 21:00):</span>
                    <span>+{formatRupiah(breakdown.nightSurcharge)}</span>
                  </div>
                )}

                {breakdown.weatherSurcharge > 0 && (
                  <div className="flex justify-between items-center text-amber-300">
                    <span>🌧️ Surcharge Cuaca Hujan:</span>
                    <span>+{formatRupiah(breakdown.weatherSurcharge)}</span>
                  </div>
                )}

                {breakdown.placeTypeSurcharge > 0 && (
                  <div className="flex justify-between items-center text-stone-500">
                    <span>🏢 Biaya Parkir & Akses Gedung:</span>
                    <span>+{formatRupiah(breakdown.placeTypeSurcharge)}</span>
                  </div>
                )}

              </div>

              {/* Total Box */}
              <div className="mt-6 pt-4 border-t border-stone-100">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase text-stone-600">Total Ongkos Transport:</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-emerald-400">
                      {breakdown.totalTransport === 0 ? 'GRATIS' : formatRupiah(breakdown.totalTransport)}
                    </span>
                    {breakdown.totalTransport === 0 && (
                      <div className="text-[10px] text-emerald-700 font-medium">Bebas Biaya Transportasi</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Explanation Note */}
              <div className="mt-4 p-3 bg-stone-800/80 rounded-xl text-[11px] text-stone-600 space-y-1">
                <div className="flex items-center gap-1 text-stone-500 font-semibold">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Jaminan Ongkir 100% Milik Mitra Terapis</span>
                </div>
                <p>
                  Seluruh ongkos transportasi diserahkan langsung kepada mitra terapis untuk biaya bensin & perawatan kendaraan mereka.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-soft-hover shadow-emerald-200 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Lanjut Pesan Terapis Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
