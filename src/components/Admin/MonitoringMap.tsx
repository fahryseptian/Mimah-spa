import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  User, 
  Phone, 
  Activity, 
  ArrowUpRight, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BatteryCharging,
  Wifi,
  Car,
  Send,
  Download,
  Layers,
  Radio,
  Compass,
  Crosshair,
  Sparkles,
  X,
  FileSpreadsheet,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Therapist } from '../../types';

// Map kecamatan coordinates to SVG space (600x450 grid representing Medan map)
const KECAMATAN_COORDS: Record<string, { x: number; y: number; code: string }> = {
  'Medan Baru': { x: 280, y: 220, code: 'MB' },
  'Medan Petisah': { x: 270, y: 160, code: 'MP' },
  'Medan Johor': { x: 310, y: 340, code: 'MJ' },
  'Medan Selayang': { x: 190, y: 280, code: 'MS' },
  'Medan Helvetia': { x: 180, y: 120, code: 'MH' },
  'Medan Sunggal': { x: 140, y: 200, code: 'MSG' },
  'Medan Polonia': { x: 330, y: 260, code: 'MPO' },
  'Medan Kota': { x: 370, y: 210, code: 'MK' },
  'Medan Denai': { x: 440, y: 250, code: 'MD' },
  'Medan Amplas': { x: 420, y: 350, code: 'MA' },
  'Medan Tuntungan': { x: 130, y: 360, code: 'MT' },
  'Medan Barat': { x: 330, y: 130, code: 'MBR' },
  'Medan Timur': { x: 400, y: 140, code: 'MTR' }
};

// Simulated landmarks in Medan
const MEDAN_LANDMARKS = [
  { name: 'Sun Plaza', x: 285, y: 195, category: 'Mall' },
  { name: 'Medan Fair', x: 240, y: 155, category: 'Mall' },
  { name: 'Podomoro City', x: 300, y: 140, category: 'Superblock' },
  { name: 'Merdeka Walk', x: 340, y: 150, category: 'Pusat Kota' },
  { name: 'RS Siloam Medan', x: 295, y: 215, category: 'Rumah Sakit' },
  { name: 'USU (Univ. Sumatera Utara)', x: 230, y: 260, category: 'Kampus' },
  { name: 'Ring Road City Walks', x: 160, y: 220, category: 'Mall' }
];

export const MonitoringMap: React.FC = () => {
  const { 
    therapists, 
    sosAlerts, 
    resolveSOSAlert, 
    triggerSOSAlert, 
    bookings, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'sos' | 'active' | 'standby'>('all');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'standard' | 'heatmap' | 'routes'>('standard');
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);

  const activeSos = sosAlerts.filter(a => a.status === 'active');
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'on_way' || b.status === 'in_progress');

  // Assign deterministic coordinates & active order mock status to therapists for realistic map placement
  const mappedTherapists = useMemo(() => {
    return therapists.map((t, idx) => {
      const baseCoord = KECAMATAN_COORDS[t.baseKecamatan] || { x: 250 + (idx * 30) % 250, y: 180 + (idx * 25) % 200, code: 'MDN' };
      // Add slight spread so therapists in same kecamatan don't overlap completely
      const offsetX = ((idx * 37) % 40) - 20;
      const offsetY = ((idx * 23) % 40) - 20;
      
      const hasSOS = activeSos.some(a => a.therapistId === t.id);
      const activeOrder = activeBookings.find(b => b.therapistId === t.id);

      return {
        ...t,
        x: Math.max(50, Math.min(550, baseCoord.x + offsetX)),
        y: Math.max(50, Math.min(410, baseCoord.y + offsetY)),
        hasSOS,
        activeOrder,
        battery: 75 + ((idx * 7) % 24), // simulated battery %
        signal: idx % 3 === 0 ? '5G' : '4G',
        speedKm: activeOrder ? 14 + (idx % 12) : 0
      };
    });
  }, [therapists, activeSos, activeBookings]);

  // Filter logic
  const filteredTherapists = useMemo(() => {
    return mappedTherapists.filter(t => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesKec = t.baseKecamatan.toLowerCase().includes(q);
        if (!matchesName && !matchesKec) return false;
      }

      // Kecamatan filter
      if (selectedKecamatan !== 'all' && t.baseKecamatan !== selectedKecamatan) {
        return false;
      }

      // Status tab filter
      if (activeTab === 'sos') return t.hasSOS;
      if (activeTab === 'active') return t.status === 'online' || t.activeOrder !== undefined;
      if (activeTab === 'standby') return t.status === 'online' && !t.activeOrder && !t.hasSOS;
      return true;
    });
  }, [mappedTherapists, searchQuery, selectedKecamatan, activeTab]);

  // Export CSV Handler
  const handleExportCSV = () => {
    const csvHeader = 'ID,Nama Terapis,Status,Kecamatan,SOS Alert,Orders Selesai,Battery,Sinyal,Telepon\n';
    const csvRows = mappedTherapists.map(t => 
      `"${t.id}","${t.name}","${t.status}","${t.baseKecamatan}","${t.hasSOS ? 'DARURAT' : 'Aman'}","${t.completedOrders}","${t.battery}%","${t.signal}","${t.phone}"`
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Monitoring_Terapis_Medan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan Monitoring GPS (.csv) Berhasil Diunduh!', 'success');
  };

  // Test SOS Trigger Handler
  const handleSimulateSOS = () => {
    if (therapists.length === 0) return;
    const targetTherapist = therapists[0];
    triggerSOSAlert(targetTherapist.id, 'Jl. Gajah Mada No. 45, Medan Petisah (Simulasi Admin Test)');
    showToast(`Sinyal SOS simulasi dipicu untuk ${targetTherapist.name}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Sistem GPS Command Center Medan 24/7</span>
            </div>
            <h3 className="text-2xl font-bold text-stone-900 font-serif-display">
              Monitoring Lapangan & Keamanan Terapis
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pantau posisi geofencing, ketersediaan terapis, status perjalanan sesi, dan tanggapan darurat SOS secara real-time di area Kota Medan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateSOS}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
              <span>Test Sinyal SOS</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Unduh Laporan (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Mitra Online</div>
              <div className="text-xl font-black text-emerald-900">
                {mappedTherapists.filter(t => t.status === 'online').length} <span className="text-xs font-normal text-emerald-700">/ {mappedTherapists.length}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Sedang Bertugas</div>
              <div className="text-xl font-black text-blue-900">
                {mappedTherapists.filter(t => t.activeOrder).length} <span className="text-xs font-normal text-blue-700">Order</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Coverage Area</div>
              <div className="text-xl font-black text-amber-900">
                13 <span className="text-xs font-normal text-amber-700">Kecamatan</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
            activeSos.length > 0 ? 'bg-rose-100 border-rose-300 animate-pulse' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeSos.length > 0 ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-700">Alert SOS Darurat</div>
              <div className={`text-xl font-black ${activeSos.length > 0 ? 'text-rose-900' : 'text-stone-900'}`}>
                {activeSos.length} <span className="text-xs font-normal text-stone-500">Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all' 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Semua ({mappedTherapists.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'active' 
                  ? 'bg-emerald-700 text-white shadow-sm' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Bertugas / Online ({mappedTherapists.filter(t => t.status === 'online').length})
            </button>
            <button
              onClick={() => setActiveTab('standby')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'standby' 
                  ? 'bg-blue-700 text-white shadow-sm' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Standby Order
            </button>
            <button
              onClick={() => setActiveTab('sos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sos' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Sinyal SOS ({activeSos.length})</span>
            </button>
          </div>

          {/* Search & Filter Kecamatan */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari terapis / lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
            >
              <option value="all">Semua Kecamatan</option>
              {Object.keys(KECAMATAN_COORDS).map(kec => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map & Interactive Panel Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Vector Map Grid (LG 8 COLS) */}
        <div className="lg:col-span-8 bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden min-h-[560px] flex flex-col justify-between">
          
          {/* Map Controls Header Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="bg-stone-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-stone-700/80 text-[11px] font-bold text-emerald-400 flex items-center gap-2 shadow-lg">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>Peta Digital Medan Vector v2.4</span>
              </div>

              <div className="bg-stone-900/90 backdrop-blur-md px-2 rounded-2xl border border-stone-700/80 flex items-center gap-1 shadow-lg text-[11px] text-stone-300">
                <button
                  onClick={() => setViewMode('standard')}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    viewMode === 'standard' ? 'bg-emerald-600 text-white' : 'hover:text-white'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setViewMode('heatmap')}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    viewMode === 'heatmap' ? 'bg-amber-600 text-white' : 'hover:text-white'
                  }`}
                >
                  Heatmap
                </button>
                <button
                  onClick={() => setViewMode('routes')}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    viewMode === 'routes' ? 'bg-blue-600 text-white' : 'hover:text-white'
                  }`}
                >
                  Rute Active
                </button>
              </div>
            </div>

            {/* Zoom & Layer Toggles */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setShowLandmarks(!showLandmarks)}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                  showLandmarks ? 'bg-emerald-600/90 text-white border-emerald-500' : 'bg-stone-900/80 text-stone-400 border-stone-700'
                }`}
                title="Toggle Landmark Mall & RS Medan"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.min(1.4, prev + 0.15))}
                className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 backdrop-blur-md text-stone-300 border border-stone-700 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(0.85, prev - 0.15))}
                className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 backdrop-blur-md text-stone-300 border border-stone-700 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setMapZoom(1); setSelectedKecamatan('all'); }}
                className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 backdrop-blur-md text-stone-300 border border-stone-700 cursor-pointer"
                title="Reset Map View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Map Canvas View */}
          <div className="w-full flex-1 relative overflow-hidden flex items-center justify-center p-4">
            <motion.div 
              className="w-full h-full relative flex items-center justify-center"
              animate={{ scale: mapZoom }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <svg 
                viewBox="0 0 600 450" 
                className="w-full h-[500px] max-h-[500px] select-none"
              >
                <defs>
                  {/* Grid Pattern */}
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  </pattern>

                  {/* Heatmap Radial Gradients */}
                  <radialGradient id="heatGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Dark Canvas Background */}
                <rect width="600" height="450" fill="#0f172a" rx="24" />
                <rect width="600" height="450" fill="url(#grid)" rx="24" />

                {/* Simulated Main Road Grid Lines of Medan (Ring Road, Sudirman, Gajah Mada, Imam Bonjol) */}
                <g stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none">
                  {/* Inner Ring Road */}
                  <path d="M 120,120 Q 300,80 480,120 Q 520,250 480,380 Q 300,420 120,380 Q 80,250 120,120 Z" strokeDasharray="4,4" />
                  {/* Main Axis North-South (Jl. Yos Sudarso - Gatot Subroto - AH Nasution) */}
                  <path d="M 280,40 L 280,410" strokeWidth="3" stroke="rgba(16,185,129,0.15)" />
                  {/* Main Axis East-West (Jl. S. Parman - Jl. Juanda) */}
                  <path d="M 60,220 L 540,220" strokeWidth="3" stroke="rgba(16,185,129,0.15)" />
                </g>

                {/* Kecamatan Boundaries & Labels */}
                {Object.entries(KECAMATAN_COORDS).map(([name, coord]) => {
                  const isSelected = selectedKecamatan === name;
                  return (
                    <g key={name} className="cursor-pointer" onClick={() => setSelectedKecamatan(name)}>
                      {/* Area boundary circle */}
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={isSelected ? 42 : 32}
                        fill={isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)'}
                        stroke={isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}
                        strokeWidth={isSelected ? 2 : 1}
                        strokeDasharray={isSelected ? 'none' : '2,2'}
                        className="transition-all duration-300 hover:fill-emerald-500/20"
                      />
                      {/* District Label Tag */}
                      <text
                        x={coord.x}
                        y={coord.y + 38}
                        textAnchor="middle"
                        fill={isSelected ? '#34d399' : '#94a3b8'}
                        fontSize="9"
                        fontWeight="bold"
                        letterSpacing="0.5"
                      >
                        {name.replace('Medan ', '')}
                      </text>
                    </g>
                  );
                })}

                {/* Heatmap Overlay Mode */}
                {viewMode === 'heatmap' && mappedTherapists.map((t) => (
                  <circle
                    key={`heat-${t.id}`}
                    cx={t.x}
                    cy={t.y}
                    r="55"
                    fill="url(#heatGradient)"
                  />
                ))}

                {/* Landmarks (Mall, RS, Kampus in Medan) */}
                {showLandmarks && MEDAN_LANDMARKS.map((lm, idx) => (
                  <g key={`lm-${idx}`} transform={`translate(${lm.x}, ${lm.y})`}>
                    <rect x="-18" y="-7" width="36" height="14" rx="4" fill="rgba(30, 41, 59, 0.85)" stroke="#475569" strokeWidth="0.8" />
                    <text x="0" y="3" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontWeight="bold">
                      📍 {lm.name.slice(0, 10)}
                    </text>
                  </g>
                ))}

                {/* Active Routes & Travel Polylines */}
                {(viewMode === 'routes' || viewMode === 'standard') && mappedTherapists.filter(t => t.activeOrder).map(t => {
                  // Connect therapist to customer destination (offset)
                  const destX = t.x + 45;
                  const destY = t.y - 35;
                  return (
                    <g key={`route-${t.id}`}>
                      {/* Dashed Animated Route Line */}
                      <path
                        d={`M ${t.x},${t.y} Q ${(t.x + destX)/2},${(t.y + destY)/2 - 15} ${destX},${destY}`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                      />
                      {/* Customer Target Marker */}
                      <circle cx={destX} cy={destY} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={destX + 9} y={destY + 3} fill="#fca5a5" fontSize="8" fontWeight="bold">
                        Pelanggan
                      </text>
                    </g>
                  );
                })}

                {/* Therapist Pins Rendering */}
                {filteredTherapists.map((t) => {
                  const isSelected = selectedTherapist?.id === t.id;
                  const isSOS = t.hasSOS;
                  const isBusy = !!t.activeOrder;
                  const isOnline = t.status === 'online';

                  return (
                    <g 
                      key={t.id} 
                      transform={`translate(${t.x}, ${t.y})`} 
                      onClick={() => setSelectedTherapist(t)}
                      className="cursor-pointer"
                    >
                      {/* SOS Wave Ripples */}
                      {isSOS && (
                        <>
                          <circle r="32" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8">
                            <animate attributeName="r" values="16;40" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.9;0" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                          <circle r="20" fill="#dc2626" opacity="0.3" />
                        </>
                      )}

                      {/* Online Pulsing Aura */}
                      {isOnline && !isSOS && (
                        <circle r="18" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6">
                          <animate attributeName="r" values="14;24" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Main Pin Outer Ring */}
                      <circle
                        r={isSelected ? "17" : "14"}
                        fill={isSOS ? '#dc2626' : isBusy ? '#2563eb' : isOnline ? '#059669' : '#64748b'}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? "3" : "2"}
                        className="shadow-xl transition-all duration-200"
                      />

                      {/* Inner Icon or Initial */}
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isSelected ? "11" : "9"}
                        fontWeight="black"
                      >
                        {isSOS ? '!' : t.name.charAt(0)}
                      </text>

                      {/* Name Label Tag on Hover/Selected */}
                      <g transform="translate(0, 22)">
                        <rect
                          x="-35"
                          y="-8"
                          width="70"
                          height="14"
                          rx="4"
                          fill={isSOS ? '#991b1b' : '#0f172a'}
                          stroke={isSelected ? '#34d399' : 'rgba(255,255,255,0.2)'}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="2"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="8"
                          fontWeight="bold"
                        >
                          {t.name.split(' ')[0]}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          </div>

          {/* Map Legend Footer Bar */}
          <div className="p-4 bg-stone-900/95 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
                <span className="text-[11px]">Online (Standby)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs" />
                <span className="text-[11px]">En Route / Sesi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping shadow-xs" />
                <span className="text-[11px] font-bold text-rose-400">SOS Darurat</span>
              </div>
            </div>

            <div className="text-[10px] text-stone-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Klik pin terapis untuk membuka detail GPS & kontak langsung</span>
            </div>
          </div>
        </div>

        {/* Sidebar Status & Detail Panel (LG 4 COLS) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Selected Therapist Inspection Card */}
          {selectedTherapist ? (
            <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-300 shadow-sm shrink-0">
                    <img src={selectedTherapist.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-sm">{selectedTherapist.name}</h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{selectedTherapist.baseKecamatan}, Medan</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTherapist(null)}
                  className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Chips */}
              <div className="grid grid-cols-3 gap-2 py-1 border-y border-stone-100 text-center">
                <div className="bg-stone-50 p-2 rounded-xl">
                  <div className="text-[9px] font-bold text-stone-400 uppercase">Status</div>
                  <div className="text-xs font-black text-emerald-700 capitalize">{selectedTherapist.status}</div>
                </div>
                <div className="bg-stone-50 p-2 rounded-xl">
                  <div className="text-[9px] font-bold text-stone-400 uppercase">Baterai</div>
                  <div className="text-xs font-black text-stone-800 flex items-center justify-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-emerald-600" />
                    <span>88%</span>
                  </div>
                </div>
                <div className="bg-stone-50 p-2 rounded-xl">
                  <div className="text-[9px] font-bold text-stone-400 uppercase">Sinyal</div>
                  <div className="text-xs font-black text-stone-800 flex items-center justify-center gap-1">
                    <Wifi className="w-3 h-3 text-blue-600" />
                    <span>5G</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={`https://wa.me/62${selectedTherapist.phone.replace(/\D/g, '').replace(/^0/, '').replace(/^62/, '')}?text=Halo%20${encodeURIComponent(selectedTherapist.name)},%20mohon%20update%20posisi%20GPS%20sesi%20pijat%20Anda.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Hubungi WA ({selectedTherapist.phone})</span>
                </a>

                {selectedTherapist.hasSOS && (
                  <button
                    onClick={() => {
                      const alert = activeSos.find(a => a.therapistId === selectedTherapist.id);
                      if (alert) resolveSOSAlert(alert.id);
                      setSelectedTherapist(null);
                    }}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesaikan Masalah SOS</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Active SOS Warnings Box */
            activeSos.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>{activeSos.length} Peringatan SOS Membutuhkan Respon</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activeSos.map(sos => (
                    <div key={sos.id} className="p-3 bg-white rounded-2xl border border-rose-200 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-extrabold text-stone-900">{sos.therapistName}</div>
                        <div className="text-[10px] text-stone-500">{sos.locationAddress}</div>
                      </div>
                      <button
                        onClick={() => resolveSOSAlert(sos.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold cursor-pointer shadow-xs shrink-0"
                      >
                        Resolve
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Therapist List Panel */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4 flex-1">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Daftar Mitra Terapis ({filteredTherapists.length})</span>
              </h4>
              <span className="text-[10px] font-bold text-stone-400">Medan Grid</span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredTherapists.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  Tidak ada terapis ditemukan dalam filter ini.
                </div>
              ) : (
                filteredTherapists.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTherapist(t)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedTherapist?.id === t.id
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                        : 'bg-stone-50/60 border-stone-100 hover:bg-stone-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0">
                        <img src={t.photoUrl} alt="" className="w-full h-full object-cover" />
                        {t.hasSOS && (
                          <span className="absolute inset-0 bg-rose-600/60 flex items-center justify-center text-white font-bold text-xs">!</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 leading-tight">{t.name}</div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{t.baseKecamatan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        t.hasSOS ? 'bg-rose-100 text-rose-700 animate-pulse' :
                        t.status === 'online' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-stone-200 text-stone-600'
                      }`}>
                        {t.hasSOS ? 'SOS Alert' : t.status}
                      </span>
                      <div className="text-[9px] text-stone-400 font-bold mt-1">
                        {t.completedOrders} Sesi
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Security Standard Card */}
          <div className="bg-stone-900 p-5 rounded-3xl text-white shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold">Protokol Geofencing Mimah</h5>
                <p className="text-[10px] text-stone-400">Keamanan terapis & privasi terjamin 24 jam</p>
              </div>
            </div>
            <p className="text-[10px] text-stone-300 leading-relaxed">
              Sinyal SOS terintegrasi langsung dengan WhatsApp Admin & Tim Satgas Mimah Spa Medan.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
