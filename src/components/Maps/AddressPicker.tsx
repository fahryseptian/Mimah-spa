import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Crosshair, Sparkles } from 'lucide-react';

interface OSMLocation {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface PlaceResult {
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface AddressPickerProps {
  onPlaceSelect: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

const POPULAR_MEDAN_SPOTS = [
  { name: 'Sun Plaza Medan', address: 'Sun Plaza, Jl. KH. Zainul Arifin No.7, Medan Petisah', lat: 3.5852, lng: 98.6712 },
  { name: 'Plaza Medan Fair', address: 'Plaza Medan Fair, Jl. Gatot Subroto No.30, Medan Petisah', lat: 3.5935, lng: 98.6601 },
  { name: 'Podomoro City Medan', address: 'Podomoro City Medan, Jl. Putri Hijau No.1, Medan Barat', lat: 3.5982, lng: 98.6750 },
  { name: 'USU Dr. Mansyur', address: 'Kampus USU, Jl. Dr. Mansyur, Medan Selayang', lat: 3.5655, lng: 98.6548 },
  { name: 'Ring Road City Walks', address: 'Ring Road City Walks, Jl. Gagak Hitam, Medan Sunggal', lat: 3.5788, lng: 98.6255 }
];

export const AddressPicker: React.FC<AddressPickerProps> = ({
  onPlaceSelect,
  placeholder = "Cari lokasi/alamat Anda di Medan (contoh: Jl. Gajah Mada)...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OSMLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocation = async () => {
      if (!query || query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Appending 'Medan' if not included to prioritize Medan region
        const searchQuery = query.toLowerCase().includes('medan') ? query : `${query}, Medan`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=id&viewbox=98.50,3.45,98.80,3.75&bounded=0`;
        const response = await fetch(url);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocation, 400);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (place: OSMLocation) => {
    setQuery(place.display_name);
    setIsOpen(false);
    onPlaceSelect({
      formattedAddress: place.display_name,
      location: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon)
      }
    });
  };

  const handleSelectPreset = (spot: typeof POPULAR_MEDAN_SPOTS[0]) => {
    setQuery(spot.address);
    setIsOpen(false);
    onPlaceSelect({
      formattedAddress: spot.address,
      location: {
        lat: spot.lat,
        lng: spot.lng
      }
    });
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Fitur Geolocation tidak didukung di peramban ini.');
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const address = data.display_name || `Lokasi GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setQuery(address);
          onPlaceSelect({
            formattedAddress: address,
            location: {
              lat: latitude,
              lng: longitude
            }
          });
        } catch (e) {
          const fallbackAddr = `Lokasi GPS Saya (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setQuery(fallbackAddr);
          onPlaceSelect({
            formattedAddress: fallbackAddr,
            location: { lat: latitude, lng: longitude }
          });
        } finally {
          setDetectingGps(false);
        }
      },
      (err) => {
        setDetectingGps(false);
        alert('Gagal mendeteksi lokasi GPS. Pastikan izin lokasi/GPS aktif di HP/Browser Anda.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div ref={wrapperRef} className={`relative space-y-2 ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-emerald-600">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-28 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1">
          {loading && (
            <div className="p-2">
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={detectingGps}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all border border-emerald-200/60 disabled:opacity-50"
            title="Deteksi Lokasi GPS Saya"
          >
            {detectingGps ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">GPS Saya</span>
          </button>
        </div>
      </div>

      {/* Popular Medan Spots Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] font-bold text-stone-400 shrink-0 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-500" /> Populer:
        </span>
        {POPULAR_MEDAN_SPOTS.map((spot, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelectPreset(spot)}
            className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 rounded-lg text-[10px] font-semibold transition-all shrink-0 border border-stone-200/50"
          >
            {spot.name}
          </button>
        ))}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-14 left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-stone-100 max-h-64 overflow-y-auto z-50">
          {results.map((place) => (
            <button
              key={place.place_id}
              type="button"
              onClick={() => handleSelect(place)}
              className="w-full text-left px-4 py-3 hover:bg-emerald-50 focus:bg-emerald-50 transition-colors flex items-start gap-3 border-b border-stone-50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-stone-700 leading-snug">
                {place.display_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

