/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, RefreshCw, ExternalLink, AlertCircle, Map as MapIcon } from 'lucide-react';
import { Map, AdvancedMarker, Pin, useMap, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { AddressPicker } from '../Maps/AddressPicker';

interface LocationPickerMapProps {
  initialAddress: string;
  initialKecamatan: string;
  onLocationSelect: (address: string, kecamatan: string, distanceKm: number, coords: { lat: number; lng: number }) => void;
  originKecamatan?: string;
  therapistName?: string;
}

const MEDAN_BASE = { lat: 3.5658, lng: 98.6572 }; // Mimah Spa HQ / Medan Baru

const KECAMATAN_COORDS: Record<string, { lat: number; lng: number }> = {
  'Medan Baru': { lat: 3.5658, lng: 98.6572 },
  'Medan Johor': { lat: 3.5284, lng: 98.6791 },
  'Medan Polonia': { lat: 3.5512, lng: 98.6713 },
  'Medan Petisah': { lat: 3.5888, lng: 98.6655 },
  'Medan Helvetia': { lat: 3.6015, lng: 98.6432 },
  'Medan Area': { lat: 3.5742, lng: 98.6923 },
  'Medan Selayang': { lat: 3.5422, lng: 98.6251 },
  'Medan Tuntungan': { lat: 3.4998, lng: 98.6115 },
  'Medan Denai': { lat: 3.5615, lng: 98.7188 },
  'Medan Sunggal': { lat: 3.5794, lng: 98.6185 },
  'Medan Barat': { lat: 3.6011, lng: 98.6672 },
  'Medan Timur': { lat: 3.5992, lng: 98.6854 },
  'Medan Deli': { lat: 3.6558, lng: 98.6784 },
  'Medan Labuhan': { lat: 3.6923, lng: 98.6741 },
  'Medan Marelan': { lat: 3.6741, lng: 98.6312 },
  'Medan Belawan': { lat: 3.7812, lng: 98.6823 },
  'Medan Amplas': { lat: 3.5358, lng: 98.7112 },
  'Medan Maimun': { lat: 3.5612, lng: 98.6804 },
  'Medan Perjuangan': { lat: 3.6012, lng: 98.6984 },
  'Medan Tembung': { lat: 3.5984, lng: 98.7182 },
  'Medan Kota': { lat: 3.5784, lng: 98.6841 },
};

const getKecamatanCoords = (kec: string) => {
  if (!kec) return MEDAN_BASE;
  const normalized = kec.trim().replace(/^medan\s+/i, '').toLowerCase();
  const match = Object.keys(KECAMATAN_COORDS).find(
    k => k.toLowerCase() === kec.toLowerCase() || 
         k.toLowerCase().replace(/^medan\s+/i, '') === normalized
  );
  return match ? KECAMATAN_COORDS[match] : MEDAN_BASE;
};

const MapController = ({ position, zoom }: { position: { lat: number; lng: number }; zoom?: number }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map && position) {
      map.panTo(position);
      if (zoom) map.setZoom(zoom);
    }
  }, [map, position, zoom]);

  return null;
};

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialAddress,
  initialKecamatan,
  onLocationSelect,
  originKecamatan,
  therapistName,
}) => {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>(MEDAN_BASE);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string>(initialAddress || 'Pusat Mimah Spa, Medan Baru');
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [kecamatan, setKecamatan] = useState<string>(initialKecamatan || 'Medan Baru');

  const activeBase = getKecamatanCoords(originKecamatan || 'Medan Baru');

  const calculateDistance = useCallback((coords: { lat: number; lng: number }) => {
    if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) return 2.5;
    if (!window.google || !window.google.maps || !google.maps.geometry) {
      // Haversine formula fallback
      const R = 6371; // Earth's radius in km
      const dLat = ((coords.lat - activeBase.lat) * Math.PI) / 180;
      const dLng = ((coords.lng - activeBase.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((activeBase.lat * Math.PI) / 180) *
          Math.cos((coords.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const safeA = Math.min(1, Math.max(0, a));
      const c = 2 * Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA));
      const d = R * c;
      const result = Math.max(1, Math.round(d * 10) / 10);
      return isNaN(result) ? 2.5 : result;
    }
    
    const base = new google.maps.LatLng(activeBase.lat, activeBase.lng);
    const target = new google.maps.LatLng(coords.lat, coords.lng);
    
    const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
      base,
      target
    );
    
    const distKm = Math.max(1, Math.round((distanceInMeters / 1000) * 10) / 10);
    return isNaN(distKm) ? 2.5 : distKm;
  }, [activeBase]);

  const handlePlaceSelect = async (place: google.maps.places.Place) => {
    if (!place.location) return;

    const coords = {
      lat: place.location.lat(),
      lng: place.location.lng()
    };

    const dist = calculateDistance(coords);
    
    setSelectedCoords(coords);
    setSelectedAddress(place.formattedAddress || place.displayName || '');
    setDistanceKm(dist);
    setKecamatan('Medan'); 
    setMapZoom(16);

    onLocationSelect(
      place.formattedAddress || place.displayName || '',
      'Medan',
      dist,
      coords
    );
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const dist = calculateDistance(coords);
        const addr = `Lokasi GPS Terdeteksi (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;

        setSelectedCoords(coords);
        setSelectedAddress(addr);
        setDistanceKm(dist);
        setIsLocating(false);
        setMapZoom(16);

        onLocationSelect(addr, 'Medan', dist, coords);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    const newDist = calculateDistance(selectedCoords);
    if (newDist !== distanceKm) {
      setDistanceKm(newDist);
      onLocationSelect(selectedAddress, kecamatan, newDist, selectedCoords);
    }
  }, [activeBase, selectedCoords, calculateDistance, distanceKm, selectedAddress, kecamatan, onLocationSelect]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const apiStatus = useApiLoadingStatus();
  const isFailed = !apiKey || apiKey.trim() === '' || apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE;

  return (
    <div className="space-y-4 bg-stone-50 p-4 rounded-[2rem] border border-stone-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {isFailed ? 'Input Alamat Manual (Mode Peta Aman)' : 'Pin-Point Lokasi Presisi'}
            </h4>
            <p className="text-[11px] text-stone-500">
              {isFailed ? 'Isi detail alamat & kecamatan Anda di bawah' : 'Cari alamat atau gunakan GPS untuk akurasi penjemputan'}
            </p>
          </div>
        </div>

        {!isFailed && (
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            {isLocating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            <span>{isLocating ? 'Mencari...' : 'GPS Saya'}</span>
          </button>
        )}
      </div>

      {isFailed ? (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl text-[11px] font-medium border border-amber-200/60 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Mode Peta Aman Aktif:</strong> Peta interaktif dinonaktifkan karena konfigurasi kunci API Google Cloud belum lengkap. Jangan khawatir, Anda tetap bisa memasukkan koordinat & alamat secara manual di bawah dengan lancar!
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Kecamatan Domisili</label>
              <select
                value={kecamatan}
                onChange={(e) => {
                  const selectedKec = e.target.value;
                  setKecamatan(selectedKec);
                  const coords = getKecamatanCoords(selectedKec);
                  setSelectedCoords(coords);
                  const dist = calculateDistance(coords);
                  setDistanceKm(dist);
                  onLocationSelect(selectedAddress, selectedKec, dist, coords);
                }}
                className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
              >
                {Object.keys(KECAMATAN_COORDS).map((kec) => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Alamat Lengkap Rumah</label>
              <input
                type="text"
                placeholder="Tuliskan nama jalan, no. rumah, RT/RW..."
                value={selectedAddress}
                onChange={(e) => {
                  const addr = e.target.value;
                  setSelectedAddress(addr);
                  onLocationSelect(addr, kecamatan, distanceKm, selectedCoords);
                }}
                className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      ) : (
        <AddressPicker onPlaceSelect={handlePlaceSelect} />
      )}

      <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
        {isFailed ? (
          <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-sm">
              <MapIcon className="w-6 h-6 animate-pulse animate-duration-1000" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Alamat Anda Tersimpan Sukses!</div>
              <div className="text-[10px] text-stone-500 max-w-xs mt-1">
                Kecamatan <strong>{kecamatan}</strong> berada dalam jangkauan home service Mimah Spa.
              </div>
            </div>
          </div>
        ) : (
          <Map
            defaultCenter={MEDAN_BASE}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={true}
            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <MapController position={selectedCoords} zoom={mapZoom} />
            <AdvancedMarker position={selectedCoords}>
              <Pin background={'#059669'} borderColor={'#047857'} glyphColor={'#ffffff'} />
            </AdvancedMarker>
          </Map>
        )}

        {/* Floating Overlays */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-bold text-stone-800 border border-stone-200 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Pos {therapistName ? `${therapistName} (${originKecamatan})` : 'Mimah HQ'}
          </span>
          
          {!isFailed && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedCoords.lat},${selectedCoords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 hover:bg-black transition-all shadow-lg pointer-events-auto cursor-pointer"
            >
              Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-100 shadow-lg flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Alamat Terpilih</div>
            <div className="text-[11px] font-bold text-stone-900 truncate">{selectedAddress || 'Belum diisi'}</div>
          </div>
          <div className="shrink-0 flex flex-col items-end">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Estimasi Jarak</div>
            <div className="text-sm font-black text-stone-900">{distanceKm} KM</div>
          </div>
        </div>
      </div>
    </div>
  );
};
