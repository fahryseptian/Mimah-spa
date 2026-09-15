import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Navigation, RefreshCw, ExternalLink, Touchpad } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AddressPicker, PlaceResult } from '../Maps/AddressPicker';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

// Haversine formula
const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const MapController = ({ position, zoom }: { position: { lat: number; lng: number }; zoom?: number }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], zoom || map.getZoom());
    }
  }, [map, position, zoom]);
  return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick: (coords: { lat: number; lng: number }) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
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
    const dist = calculateHaversine(activeBase.lat, activeBase.lng, coords.lat, coords.lng);
    const result = Math.max(1, Math.round(dist * 10) / 10);
    return isNaN(result) ? 2.5 : result;
  }, [activeBase]);

  const updateLocationState = useCallback((coords: { lat: number; lng: number }, addr: string, kec: string = 'Medan') => {
    const dist = calculateDistance(coords);
    setSelectedCoords(coords);
    setSelectedAddress(addr);
    setDistanceKm(dist);
    setKecamatan(kec);
    onLocationSelect(addr, kec, dist, coords);
  }, [calculateDistance, onLocationSelect]);

  const handleMapCoordinateSelect = useCallback(async (coords: { lat: number; lng: number }) => {
    let addr = `Pin-point (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        addr = data.display_name;
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    }
    updateLocationState(coords, addr);
  }, [updateLocationState]);

  const handlePlaceSelect = async (place: PlaceResult) => {
    if (!place.location) return;

    const coords = {
      lat: place.location.lat,
      lng: place.location.lng
    };

    setMapZoom(16);
    updateLocationState(coords, place.formattedAddress || 'Alamat Terpilih');
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung fitur GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        let addr = `Lokasi GPS Terdeteksi (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
          const data = await response.json();
          if (data && data.display_name) {
            addr = data.display_name;
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
        }

        setIsLocating(false);
        setMapZoom(16);
        updateLocationState(coords, addr);
      },
      (error) => {
        console.error('Error GPS:', error);
        setIsLocating(false);
        alert('Gagal mendapatkan lokasi GPS. Pastikan izin lokasi/GPS aktif di perangkat Anda.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const markerEventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          const latLng = marker.getLatLng();
          handleMapCoordinateSelect({ lat: latLng.lat, lng: latLng.lng });
        }
      },
    }),
    [handleMapCoordinateSelect]
  );

  useEffect(() => {
    const newDist = calculateDistance(selectedCoords);
    if (newDist !== distanceKm) {
      setDistanceKm(newDist);
      onLocationSelect(selectedAddress, kecamatan, newDist, selectedCoords);
    }
  }, [activeBase, selectedCoords, calculateDistance, distanceKm, selectedAddress, kecamatan, onLocationSelect]);

  return (
    <div className="space-y-4 bg-stone-50 p-4 rounded-[2rem] border border-stone-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Pin-Point Lokasi Presisi
            </h4>
            <p className="text-[11px] text-stone-500">
              Klik peta / geser pin / gunakan GPS untuk penjemputan akurat
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer z-10"
        >
          {isLocating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          <span>{isLocating ? 'Mencari...' : 'GPS Saya'}</span>
        </button>
      </div>

      <AddressPicker onPlaceSelect={handlePlaceSelect} />

      <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-stone-200 shadow-inner z-0">
        <MapContainer 
          center={[MEDAN_BASE.lat, MEDAN_BASE.lng]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController position={selectedCoords} zoom={mapZoom} />
          <MapClickHandler onMapClick={handleMapCoordinateSelect} />
          <Marker 
            position={[selectedCoords.lat, selectedCoords.lng]} 
            draggable={true}
            eventHandlers={markerEventHandlers}
          />
        </MapContainer>

        {/* Floating Overlays */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-[1000]">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-bold text-stone-800 border border-stone-200 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Pos {therapistName ? `${therapistName} (${originKecamatan})` : 'Mimah HQ'}
          </span>
          
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${selectedCoords.lat},${selectedCoords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 hover:bg-black transition-all shadow-lg pointer-events-auto cursor-pointer"
          >
            Google Maps <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-100 shadow-lg flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              <Touchpad className="w-3 h-3 text-emerald-600" />
              <span>Alamat (Geser Pin / Klik Peta)</span>
            </div>
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

