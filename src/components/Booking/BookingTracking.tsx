import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Send, 
  Star, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Navigation, 
  Sparkles, 
  ChevronRight,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle,
  Users,
  Car
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { BookingItem, BookingStatus } from '../../types';
import { formatRupiah, getStatusBadge, generateWhatsAppBookingMessage, generateGoogleCalendarUrl } from '../../utils/formatters';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export const BookingTracking: React.FC = () => {
  const { 
    bookings, 
    activeBooking, 
    setActiveBooking, 
    updateBookingStatus, 
    submitReview, 
    setIsBookingModalOpen,
    setSelectedServiceForBooking,
    services,
    whatsappNumber,
    addPoints
  } = useApp();

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Default Medan Coordinates
  const MEDAN_CENTER = { lat: 3.595196, lng: 98.672226 };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (id) {
      const foundBooking = bookings.find(b => b.bookingCode === id);
      if (foundBooking) {
        setActiveBooking(foundBooking);
      } else {
        // Fetch from Supabase if not in local state
        supabase
          .from('bookings')
          .select('*')
          .eq('bookingCode', id)
          .single()
          .then(({ data }) => {
            if (data) {
              setActiveBooking(data as BookingItem);
            }
          });
      }
    }
  }, [bookings, setActiveBooking]);

  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');

  const currentBooking = activeBooking || bookings[0];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;
    submitReview(
      currentBooking.therapistId || 'terapis-1',
      currentBooking.id,
      ratingInput,
      commentInput,
      currentBooking.customerName
    );
    addPoints(1000);
    setCommentInput('');
  };

  const handleReorder = (booking: BookingItem) => {
    const targetService = services.find(s => s.id === booking.serviceId) || services[0];
    setSelectedServiceForBooking(targetService);
    setIsBookingModalOpen(true);
  };

  if (!currentBooking) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-4">
        <Clock className="w-12 h-12 text-stone-500 mx-auto" />
        <h3 className="text-lg font-bold text-stone-800">Belum Ada Riwayat Pemesanan</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Pesan terapis profesional untuk panggilan ke rumah, kos, apartemen, atau hotel Anda sekarang.
        </p>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          Pesan Terapis Sekarang
        </button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(currentBooking.status);

  // Status progression stages
  const stages: { key: BookingStatus; label: string; desc: string }[] = [
    { key: 'confirmed', label: 'Dikonfirmasi', desc: 'Terapis telah ditugaskan' },
    { key: 'therapist_on_the_way', label: 'Menuju Lokasi', desc: 'Terapis dalam perjalanan bermotor' },
    { key: 'therapist_arrived', label: 'Tiba di Lokasi', desc: 'Terapis sampai di alamat penjemputan' },
    { key: 'in_session', label: 'Sesi Terapi', desc: 'Pelayanan pijat/spa sedang berjalan' },
    { key: 'completed', label: 'Selesai', desc: 'Layanan kebugaran sukses dituntaskan' },
  ];

  const getStageIndex = (status: BookingStatus) => {
    return stages.findIndex(s => s.key === status);
  };

  const currentStageIndex = getStageIndex(currentBooking.status);

  // Coordinates for mapping
  const customerPos = { 
    lat: currentBooking.customerLat || MEDAN_CENTER.lat, 
    lng: currentBooking.customerLng || MEDAN_CENTER.lng 
  };
  
  // Simulate therapist position if not set (offset slightly for visuals in demo)
  const therapistPos = {
    lat: currentBooking.therapistLat || (customerPos.lat + 0.005),
    lng: currentBooking.therapistLng || (customerPos.lng + 0.005)
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Active Live Tracking Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentBooking.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-stone-200 shadow-premium overflow-hidden"
        >
          
          {/* Card Header */}
          <div className="bg-stone-900 text-white p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <motion.span 
                  layoutId={`status-${currentBooking.id}`}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadge.color} bg-white/10 backdrop-blur-md`}
                >
                  {statusBadge.label}
                </motion.span>
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Order ID: #{currentBooking.bookingCode}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-display leading-tight">{currentBooking.serviceTitle}</h2>
              <div className="flex flex-wrap items-center gap-6 text-sm text-stone-300 font-medium">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" /> {currentBooking.bookingDate}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> {currentBooking.bookingTimeSlot} WIB</span>
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" /> {currentBooking.durationMinutes} Menit</span>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={generateGoogleCalendarUrl(currentBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 backdrop-blur-md border border-white/20 shadow-lg transition-all"
                title="Tambah ke Google Calendar"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>+ Google Calendar</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppBookingMessage(currentBooking)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-emerald-900/40 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Hubungi Admin/Terapis</span>
              </motion.a>
            </div>
          </div>

          {/* Real Map Integration */}
          <div className="h-[350px] relative w-full border-b border-stone-100 group">
            {GOOGLE_MAPS_API_KEY ? (
              <Map
                defaultCenter={customerPos}
                defaultZoom={15}
                mapId="DEMO_MAP_ID"
                className="w-full h-full"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              >
                {/* Customer Marker */}
                <AdvancedMarker position={customerPos} title="Lokasi Anda">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-emerald-500/20 rounded-full animate-ping" />
                    <div className="p-2.5 bg-emerald-600 rounded-2xl shadow-xl border-2 border-white transform hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap font-bold shadow-xl pointer-events-none">
                      Lokasi Anda
                    </div>
                  </div>
                </AdvancedMarker>

                {/* Therapist Marker (only if on the way) */}
                {(currentBooking.status === 'therapist_on_the_way' || currentBooking.status === 'confirmed') && (
                  <AdvancedMarker position={therapistPos} title="Lokasi Terapis">
                      <div className="relative group">
                      <div className="p-2.5 bg-stone-900 rounded-2xl shadow-xl border-2 border-white transform hover:scale-110 transition-transform">
                        <Car className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap font-bold shadow-xl pointer-events-none">
                        Terapis (OTW)
                      </div>
                    </div>
                  </AdvancedMarker>
                )}
              </Map>
            ) : (
              <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-stone-300" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-800">Visual Peta Sedang Disiapkan</h4>
                  <p className="text-[10px] text-stone-500 max-w-[250px]">Gunakan Maps Demo Key untuk mengaktifkan pelacakan real-time Terapis di wilayah Medan.</p>
                </div>
                <button 
                  onClick={() => window.open('https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio', '_blank')}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Dapatkan Demo Key
                </button>
              </div>
            )}
            
            {/* Map Overlay Stats */}
            <div className="absolute top-6 left-6 z-10">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/50 space-y-1 min-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Status Perjalanan</span>
                </div>
                <div className="text-xs font-bold text-stone-900">
                  {currentBooking.status === 'therapist_on_the_way' ? 'Terapis sedang meluncur' : 'Menunggu konfirmasi terapis'}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Estimasi: 12 Menit
                </div>
              </div>
            </div>
          </div>

          {/* Live Timeline Tracker */}
          <div className="p-8 sm:p-12 border-b border-stone-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Pelacakan Kedatangan Real-time
              </h3>
              <div className="text-emerald-700 font-black text-xs uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                Estimasi Tiba: <span className="animate-pulse">15-20 Menit</span>
              </div>
            </div>

            <div className="relative mt-2">
              {/* Horizontal Line for desktop */}
              <div className="hidden sm:block absolute top-6 left-8 right-8 h-1 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stages.length > 1 && currentStageIndex >= 0 ? Math.min(100, Math.max(0, (currentStageIndex / (stages.length - 1)) * 100)) : 0}%`,
                  }}
                  transition={{ type: 'spring', stiffness: 40, damping: 20 }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-4">
                {stages.map((stage, idx) => {
                  const isPassed = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={stage.key} className="flex sm:flex-col items-center sm:text-center gap-5 sm:gap-4 relative z-10">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isCurrent ? 1.2 : 1,
                          backgroundColor: isCurrent ? '#059669' : isPassed ? '#065f46' : '#ffffff',
                          borderColor: isPassed ? '#065f46' : '#e7e5e4',
                          color: isPassed ? '#ffffff' : '#a8a29e'
                        }}
                        className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-sm shadow-xl relative border-2 transition-all duration-500 ${
                          isCurrent ? 'ring-8 ring-emerald-100' : ''
                        }`}
                      >
                        {isPassed && !isCurrent ? (
                          <CheckCircle className="w-7 h-7 text-white" />
                        ) : isCurrent ? (
                          <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                          >
                            <Clock className="w-7 h-7 text-white" />
                          </motion.div>
                        ) : (
                          <span className="text-sm">{idx + 1}</span>
                        )}
                        
                        {isCurrent && (
                          <span className="absolute -top-1 -right-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white"></span>
                          </span>
                        )}
                      </motion.div>
                      <div className="flex-1 sm:flex-none space-y-1">
                        <div className={`text-[11px] font-black uppercase tracking-widest ${isCurrent ? 'text-emerald-800' : isPassed ? 'text-stone-900' : 'text-stone-400'}`}>
                          {stage.label}
                        </div>
                        <div className={`text-[9px] font-bold uppercase tracking-tighter transition-opacity duration-500 ${isCurrent ? 'opacity-100 text-stone-500' : 'opacity-40 text-stone-400'}`}>
                          {stage.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Status Simulation Bar */}
            <div className="mt-12 p-6 bg-stone-50 rounded-[2rem] border border-stone-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-stone-900 uppercase tracking-widest">Simulator Operasional</div>
                  <div className="text-[10px] text-stone-500 font-medium">Uji alur perjalanan terapis (Mode Demo)</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: '1. OTW', status: 'therapist_on_the_way' },
                  { label: '2. Tiba', status: 'therapist_arrived' },
                  { label: '3. Sesi', status: 'in_session' },
                  { label: '4. Selesai', status: 'completed' }
                ].map((sim) => (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    key={sim.status}
                    onClick={() => updateBookingStatus(currentBooking.id, sim.status as any)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      currentBooking.status === sim.status 
                        ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-200' 
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {sim.label}
                  </motion.button>
                ))}
              </div>
            </div>

          </div>

          {/* Assigned Therapist Details & Address Details */}
          <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-stone-50/30">
            
            {/* Therapist Card */}
            <div className="bg-white p-8 rounded-3xl border border-stone-100 space-y-6 shadow-sm hover:shadow-md transition-all duration-500">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Mitra Terapis Penanggung Jawab</h4>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={currentBooking.therapistPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}
                    alt={currentBooking.therapistName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-[2rem] object-cover border-2 border-emerald-50 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-600 rounded-lg text-white shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-lg text-stone-900 font-serif-display">{currentBooking.therapistName || 'Terapis Mimah Spa'}</h4>
                  <div className="text-[11px] text-emerald-700 font-black uppercase tracking-widest">BNSP Certified Practitioner</div>
                  <div className="text-[11px] text-stone-500 font-medium">Spesialisasi: Mimah Signature & Reflexology</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-50">
                <div className="p-3 bg-stone-50 rounded-2xl space-y-1">
                  <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Minyak Esensial</div>
                  <div className="text-[11px] font-bold text-stone-900">{currentBooking.selectedOil}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl space-y-1">
                  <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Tekanan Pijat</div>
                  <div className="text-[11px] font-bold text-stone-900 uppercase">{currentBooking.pressureLevel}</div>
                </div>
              </div>
            </div>

            {/* Delivery Location & Transport Details */}
            <div className="bg-white p-8 rounded-3xl border border-stone-100 space-y-6 shadow-sm hover:shadow-md transition-all duration-500">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Destinasi Layanan & Koordinat</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-black text-stone-900 uppercase tracking-widest">{currentBooking.customerName} • {currentBooking.customerPhone}</div>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">{currentBooking.address}, {currentBooking.kecamatan}, {currentBooking.city}</p>
                  </div>
                </div>
                
                {currentBooking.addressNotes && (
                  <div className="text-[10px] text-stone-500 bg-stone-50 p-4 rounded-2xl border border-stone-100 italic font-medium">
                    "Patokan: {currentBooking.addressNotes}"
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Jarak Tempuh ({currentBooking.estimatedDistanceKm} km)</div>
                  <div className="text-sm font-black text-emerald-800">
                    {currentBooking.transportCost === 0 ? 'Bebas Ongkir (Promo)' : formatRupiah(currentBooking.transportCost)}
                  </div>
                </div>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentBooking.address}, ${currentBooking.kecamatan}, ${currentBooking.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-stone-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Maps</span>
                </motion.a>
              </div>
            </div>

          </div>

          {/* Review Submission Form if Completed */}
          {currentBooking.status === 'completed' && !currentBooking.rating && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-8 sm:p-12 bg-emerald-50/50 border-t border-emerald-100"
            >
              <form onSubmit={handleReviewSubmit} className="max-w-2xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <span>Kualitas Layanan & Rating</span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900">
                  Bagaimana pengalaman terapi Anda <br className="hidden sm:block" /> bersama {currentBooking.therapistName}?
                </h4>

                {/* Star Selector */}
                <div className="flex justify-center gap-4 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      className="p-1 cursor-pointer transition-transform"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= ratingInput
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-stone-200 text-stone-200'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-4">
                  <textarea
                    rows={3}
                    placeholder="Tulis ulasan jujur Anda... (contoh: Pijatan sangat pas, terapis sopan, aroma terapinya menenangkan)"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-[2rem] px-8 py-6 text-sm text-stone-900 placeholder:text-stone-400 shadow-xl shadow-emerald-900/5 focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none"
                    required
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-10 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/30"
                  >
                    Kirim Penilaian Mimah Spa
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* History of All Bookings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-stone-900 font-serif-display">
            Arsip Reservasi Anda
          </h3>
          <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            {bookings.length} Pesanan Tercatat
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {bookings.map((b, idx) => {
              const badge = getStatusBadge(b.status);
              const isCurrent = activeBooking && activeBooking.id === b.id;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={b.id}
                  className={`p-6 sm:p-8 rounded-[2rem] border bg-white shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all duration-500 group ${
                    isCurrent ? 'ring-2 ring-emerald-600 border-emerald-600 shadow-premium scale-[1.01]' : 'border-stone-100 hover:border-stone-200'
                  }`}
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-black text-stone-900 tracking-widest uppercase">ID: #{b.bookingCode}</span>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">• {b.bookingDate}, {b.bookingTimeSlot} WIB</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-stone-900 font-serif-display group-hover:text-emerald-800 transition-colors">{b.serviceTitle}</h4>
                      <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {b.therapistName || 'Terapis Mimah Spa'}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {b.kecamatan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-10 border-t lg:border-t-0 lg:border-l border-stone-100 pt-6 lg:pt-0 lg:pl-10">
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Total Bill</div>
                      <div className="text-xl font-black text-emerald-800 tracking-tighter">{formatRupiah(b.totalAmount)}</div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveBooking(b)}
                        className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-stone-200"
                      >
                        Detail
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReorder(b)}
                        className="px-5 py-3 border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Repeat
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
