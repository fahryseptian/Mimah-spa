/// <reference types="@types/google.maps" />
import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, Search } from 'lucide-react';

interface AddressPickerProps {
  onPlaceSelect: (place: google.maps.places.Place) => void;
  placeholder?: string;
  className?: string;
}

export const AddressPicker: React.FC<AddressPickerProps> = ({
  onPlaceSelect,
  placeholder = "Cari lokasi rumah Anda (contoh: Jl. Gajah Mada No. 1)...",
  className = ""
}) => {
  const placesLibrary = useMapsLibrary('places');
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (!placesLibrary || !autocompleteRef.current) return;

    const autocompleteElement = autocompleteRef.current;

    const handleSelect = (event: any) => {
      const place = event.target.value;
      if (place) {
        onPlaceSelect(place);
      }
    };

    autocompleteElement.addEventListener('gmp-select', handleSelect);

    return () => {
      autocompleteElement.removeEventListener('gmp-select', handleSelect);
    };
  }, [placesLibrary, onPlaceSelect]);

  if (!placesLibrary) {
    return (
      <div className="w-full h-12 bg-stone-100 animate-pulse rounded-2xl border border-stone-200" />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-emerald-600">
        <Search className="w-5 h-5" />
      </div>
      {/* @ts-ignore */}
      <gmp-basic-place-autocomplete
        ref={autocompleteRef}
        className="w-full"
      >
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
        />
      </gmp-basic-place-autocomplete>
    </div>
  );
};
