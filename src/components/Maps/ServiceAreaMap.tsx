import React from 'react';
import { Map, AdvancedMarker, Pin, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { Map as MapIcon, ShieldCheck } from 'lucide-react';

interface ServiceAreaMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
}

export const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  center = { lat: 3.5952, lng: 98.6722 }, // Medan Center
  zoom = 12
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const apiStatus = useApiLoadingStatus();
  const isFailed = !apiKey || apiKey.trim() === '' || apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE;

  if (isFailed) {
    return (
      <div className="w-full h-[400px] rounded-[2.5rem] bg-stone-50 border border-stone-100 shadow-premium p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-sm">
          <MapIcon className="w-8 h-8 animate-pulse animate-duration-1000" />
        </div>
        <div className="space-y-2 max-w-md">
          <h4 className="text-base font-bold text-stone-900">Area Jangkauan Mimah Spa</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Mimah Spa melayani panggilan langsung ke rumah Anda di <strong>seluruh wilayah administratif Kota Medan</strong>, termasuk Medan Baru, Johor, Polonia, Petisah, Helvetia, Selayang, dan sekitarnya (radius hingga 20 KM dari pusat kota).
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl text-[11px] font-bold text-emerald-800 border border-emerald-100">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Layanan 100% Bergaransi Tepat Waktu</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-premium">
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={true}
        mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      >
        <AdvancedMarker position={center} title="Mimah Spa Center">
          <Pin background={'#059669'} borderColor={'#047857'} glyphColor={'#ffffff'} />
        </AdvancedMarker>
      </Map>
    </div>
  );
};
