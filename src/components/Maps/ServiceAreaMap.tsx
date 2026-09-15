import React from 'react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import { ShieldCheck } from 'lucide-react';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ServiceAreaMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
}

export const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  center = { lat: 3.5952, lng: 98.6722 }, // Medan Center
  zoom = 12
}) => {
  return (
    <div className="relative w-full h-[400px] rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-premium">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[center.lat, center.lng]} />
        <Circle 
          center={[center.lat, center.lng]}
          pathOptions={{ fillColor: '#059669', fillOpacity: 0.1, color: '#059669', weight: 2 }}
          radius={20000} // 20km radius approx for Medan
        />
      </MapContainer>
      
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-2xl text-[11px] font-bold text-emerald-800 border border-emerald-100 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Area Jangkauan (Radius 20KM)</span>
        </div>
      </div>
    </div>
  );
};
