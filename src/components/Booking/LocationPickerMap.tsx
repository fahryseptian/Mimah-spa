import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Navigation, RefreshCw, ExternalLink, Touchpad, Car, Route } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AddressPicker, PlaceResult } from '../Maps/AddressPicker';
import { getDrivingRoute } from '../../utils/routingService';

// Custom Marker Icons for Leaflet
const baseIcon = L.divIcon({
  className: 'custom-base-pin',
  html: `<div style="background-color: #065f46; color: white; width: 32px; height: 32px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const destinationIcon = L.divIcon({
  className: 'custom-dest-pin',
  html: `<div style="background-color: #e11d48; color: white; width: 34px; height: 34px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.35);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
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
  const [distanceKm, setDistanceKm] = useState<number>(1.5);
  const [durationMins, setDurationMins] = useState<number>(8);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [roadName, setRoadName] = useState<string>('');
  const [kecamatan, setKecamatan] = useState<string>(initialKecamatan || 'Medan Baru');

  const activeBase = getKecamatanCoords(originKecamatan || 'Medan Baru');

  // Fetch real car driving route
  const updateRouteAndLocation = useCallback(async (
    coords: { lat: number; lng: number },
    addr: string,
    kec: string = 'Medan'
  ) => {
    setSelectedCoords(coords);
    setSelectedAddress(addr);
    setKecamatan(kec);
    setIsCalculatingRoute(true);

    const route = await getDrivingRoute(activeBase.lat, activeBase.lng, coords.lat, coords.lng);

    setDistanceKm(route.distanceKm);
    setDurationMins(route.durationMinutes);
    setRouteCoords(route.coordinates);
    setRoadName(route.roadName || '');
    setIsCalculatingRoute(false);

    onLocationSelect(addr, kec, route.distanceKm, coords);
  }, [activeBase, onLocationSelect]);

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
    updateRouteAndLocation(coords, addr);
  }, [updateRouteAndLocation]);

  const handlePlaceSelect = async (place: PlaceResult) => {
    if (!place.location) return;

    const coords = {
      lat: place.location.lat,
      lng: place.location.lng
    };

    setMapZoom(15);
    updateRouteAndLocation(coords, place.formattedAddress || 'Alamat Terpilih');
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
        setMapZoom(15);
        updateRouteAndLocation(coords, addr);
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

  // Initial load route calculation
  useEffect(() => {
    updateRouteAndLocation(selectedCoords, selectedAddress, kecamatan);
  }, [activeBase.lat, activeBase.lng]);

  return (
    <div className="space-y-4 bg-stone-50 p-4 rounded-[2rem] border border-stone-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Route className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Navigasi Jalur Mobil Real</span>
              <span className="text-[9px] bg-emerald-700 text-white font-extrabold px-1.5 py-0.5 rounded-full">
                Jalan Raya
              </span>
            </h4>
            <p className="text-[11px] text-stone-500">
              Perhitungan jarak mengikuti rute jalan raya kendaraan mobil/motor sesungguhnya
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

      <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-stone-200 shadow-inner z-0">
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
          
          {/* Base Position Marker */}
          <Marker 
            position={[activeBase.lat, activeBase.lng]} 
            icon={baseIcon}
          />

          {/* Customer Destination Marker */}
          <Marker 
            position={[selectedCoords.lat, selectedCoords.lng]} 
            draggable={true}
            eventHandlers={markerEventHandlers}
            icon={destinationIcon}
          />

          {/* Real Driving Route Polyline */}
          {routeCoords.length > 0 && (
            <Polyline 
              positions={routeCoords} 
              pathOptions={{ 
                color: '#059669', 
                weight: 5, 
                opacity: 0.9, 
                lineCap: 'round',
                lineJoin: 'round'
              }} 
            />
          )}
        </MapContainer>

        {/* Floating Header Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-[1000]">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-bold text-stone-800 border border-stone-200 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Pos {therapistName ? `${therapistName} (${originKecamatan})` : 'Mimah HQ'}</span>
          </span>
          
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${activeBase.lat},${activeBase.lng}&destination=${selectedCoords.lat},${selectedCoords.lng}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 hover:bg-black transition-all shadow-lg pointer-events-auto cursor-pointer"
          >
            <Car className="w-3 h-3 text-emerald-400" />
            <span>Buka Rute Navigasi</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Bottom Route Summary Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-100 shadow-lg flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              <Car className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rute Jalur Kendaraan Mobil / Motor</span>
              {isCalculatingRoute && <RefreshCw className="w-3 h-3 animate-spin text-emerald-600 ml-1" />}
            </div>
            <div className="text-[11px] font-bold text-stone-900 truncate mt-0.5">
              {selectedAddress || 'Belum diisi'}
            </div>
            {roadName && (
              <div className="text-[10px] text-emerald-700 font-medium truncate">
                Jalur via: {roadName}
              </div>
            )}
          </div>

          <div className="shrink-0 flex flex-col items-end pl-3 border-l border-stone-200">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1">
              <span>Jarak Jalan</span>
            </div>
            <div className="text-base font-black text-stone-900 leading-tight">
              {distanceKm} KM
            </div>
            <div className="text-[10px] font-bold text-stone-500">
              ~{durationMins} mnt perjalanan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


