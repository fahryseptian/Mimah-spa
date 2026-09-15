import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

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

export const AddressPicker: React.FC<AddressPickerProps> = ({
  onPlaceSelect,
  placeholder = "Cari lokasi rumah Anda (contoh: Jl. Gajah Mada)...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OSMLocation[]>([]);
  const [loading, setLoading] = useState(false);
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
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchLocation, 500);
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

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
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
        className="w-full pl-12 pr-10 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
      />
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
        </div>
      )}

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 max-h-64 overflow-y-auto z-50">
          {results.map((place) => (
            <button
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="w-full text-left px-4 py-3 hover:bg-emerald-50 focus:bg-emerald-50 transition-colors flex items-start gap-3 border-b border-stone-50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm text-stone-700 leading-tight">
                {place.display_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

