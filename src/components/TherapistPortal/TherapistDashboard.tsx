import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Wallet, 
  Clock, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  Power, 
  PackageCheck,
  Calendar,
  Sparkles,
  ChevronRight,
  UserCheck,
  Copy,
  Target,
  Navigation,
  MessageCircle,
  AlertTriangle,
  Play,
  Plus,
  PlusCircle,
  ArrowUpRight,
  CreditCard,
  History,
  User,
  LogOut,
  BellRing,
  Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, getStatusBadge } from '../../utils/formatters';
import { PushNotificationSwitch } from './PushNotificationSwitch';
import { supabase } from '../../lib/supabase';
import { ActiveSessionGuide } from './ActiveSessionGuide';
import { TherapistSchedule } from './TherapistSchedule';
import { IncomingOrderAlertModal } from './IncomingOrderAlertModal';
import { soundFx } from '../../utils/audioAlert';

export const TherapistDashboard: React.FC = () => {
  const { 
    therapists, 
    updateTherapist,
    currentTherapistId, 
    setCurrentTherapistId, 
    toggleTherapistStatus, 
    bookings, 
    updateBookingStatus,
    showToast,
    addOns,
    addAddonToBooking,
    requestCashout,
    cashoutRequests,
    updateTherapistSchedule,
    logout
  } = useApp();

  const therapist = therapists.find(t => t.id === currentTherapistId) || therapists[0];
  const isOnline = therapist.status === 'online';
  const isBreak = therapist.status === 'busy';

  const handleToggleBreak = () => {
    if (isBreak) {
      updateTherapist(therapist.id, { status: 'online' });
      showToast('Selesai istirahat! Status Anda kembali Siap Tugas (Online).', 'success');
    } else {
      updateTherapist(therapist.id, { status: 'busy' });
      showToast('Mode Istirahat Aktif. Pesanan masuk dijeda sementara.', 'info');
    }
  };

  // State to track previous bookings length to trigger push notification
  const [prevBookingsCount, setPrevBookingsCount] = useState(bookings.length);

  useEffect(() => {
    // Detect new bookings
    if (bookings.length > prevBookingsCount) {
      const newOrders = bookings.filter(b => b.status === 'pending');
      if (newOrders.length > 0 && Notification.permission === 'granted') {
        const latest = newOrders[0];
        try {
          new Notification('🔔 Pesanan Baru Masuk!', {
            body: `Ada pesanan dari ${latest.customerName} di ${latest.kecamatan}. Buka aplikasi untuk menerima!`,
            icon: '/favicon.png',
          });
        } catch (e) {
          console.log('Failed to trigger notification:', e);
        }
      }
    }
    setPrevBookingsCount(bookings.length);
  }, [bookings.length, prevBookingsCount]);

  // Filter tasks assigned to this therapist or pending nearby
  const assignedBookings = bookings.filter(b => b.therapistId === therapist.id || (!b.therapistId && b.city === therapist.baseCity));

  const activeOrders = assignedBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const completedOrders = assignedBookings.filter(b => b.status === 'completed');

  const dailyTarget = 1000000;
  const currentEarnings = therapist.dailyEarnings || 480000;
  const targetProgress = dailyTarget > 0 && !isNaN(currentEarnings) ? Math.min(Math.max(0, (currentEarnings / dailyTarget) * 100), 100) : 0;

  const [activeTab, setActiveTab] = useState<'tugas' | 'performa' | 'jadwal' | 'kit' | 'materi'>('tugas');

  // New States for Upsell and Cashout Features
  const [selectedOrderForAddon, setSelectedOrderForAddon] = useState<string | null>(null);
  const [cashoutAmount, setCashoutAmount] = useState<string>('');
  const [cashoutBank, setCashoutBank] = useState<string>('Bank BCA');
  const [cashoutAccountNo, setCashoutAccountNo] = useState<string>('');
  const [cashoutAccountName, setCashoutAccountName] = useState<string>('');
  const [incomingOrderAlert, setIncomingOrderAlert] = useState<any | null>(null);

  const handleAcceptIncomingOrder = (order: any) => {
    updateBookingStatus(order.id, 'therapist_on_the_way');
    showToast(`Pesanan #${order.bookingCode} berhasil diterima! Menuju lokasi klien.`, 'success');
    setIncomingOrderAlert(null);
  };

  const handleDeclineIncomingOrder = (order: any, reason: string) => {
    showToast(`Pesanan #${order.bookingCode} dilewati: ${reason}`, 'info');
    setIncomingOrderAlert(null);
  };

  const triggerTestOrderAlert = () => {
    const target = activeOrders[0] || bookings[0] || {
      id: 'demo-incoming-1',
      bookingCode: 'MIMAH-' + Math.floor(1000 + Math.random() * 9000),
      serviceTitle: 'Traditional Javanese & North-Sumatran Massage',
      servicePrice: 195000,
      durationMinutes: 90,
      totalAmount: 207000,
      transportCost: 12000,
      estimatedDistanceKm: 4.2,
      customerName: 'Sarah Siregar',
      customerPhone: '0812-8899-7766',
      address: 'Jl. Setiabudi No. 124, Komplek Tasbih I',
      kecamatan: 'Medan Selayang',
      city: 'Medan',
      addressNotes: 'Pagar hitam, sebelah pohon mangga',
      bookingTimeSlot: '14:00 - 15:30',
      status: 'confirmed'
    };
    soundFx.playIncomingOrderChime();
    setIncomingOrderAlert(target);
  };

  return (
    <div className="space-y-8 w-full max-w-full overflow-x-hidden pb-32">
      
      {/* Optimized Header Card */}
      <div className="bg-stone-950 text-white rounded-[3.5rem] p-8 sm:p-12 border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group">
        {/* Abstract Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -mr-64 -mt-64 blur-[100px] pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full -ml-48 -mb-48 blur-[80px] pointer-events-none" />
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

        <div className="relative z-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="relative">
                <motion.div 
                  animate={{ scale: isOnline ? [1, 1.08, 1] : 1, opacity: isOnline ? [0.2, 0.4, 0.2] : 0 }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -inset-4 bg-emerald-500 rounded-full blur-2xl" 
                />
                <div className="relative p-1 bg-white/5 rounded-[2.5rem] border border-white/10">
                  <img
                    src={therapist.photoUrl}
                    alt={therapist.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.2rem] object-cover shadow-2xl"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-2xl border-[6px] border-stone-950 flex items-center justify-center ${
                    isOnline ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-stone-700'
                  }`}>
                    <Power className={`w-4 h-4 text-white ${isOnline ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                      {isOnline ? 'Status: Active' : 'Status: Offline'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest">Verified Mitra</span>
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black font-serif-display tracking-tight text-white leading-tight">
                    {therapist.name}
                  </h1>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      {therapist.rating}
                      <span className="text-stone-500 font-medium text-[10px] ml-1">({therapist.reviewCount} Ulasan)</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="flex items-center gap-1.5 text-stone-400">
                      <MapPin className="w-4 h-4" />
                      {therapist.baseKecamatan}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 md:self-start">
              <select
                value={currentTherapistId}
                onChange={(e) => setCurrentTherapistId(e.target.value)}
                className="bg-white/5 text-stone-400 border border-white/10 rounded-2xl px-5 py-3 text-[11px] font-black uppercase tracking-widest outline-none hover:bg-white/10 transition-all cursor-pointer appearance-none min-w-[180px]"
              >
                {therapists.map(t => (
                  <option key={t.id} value={t.id} className="bg-stone-900 text-white">Sesi: {t.name}</option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-stone-300 hover:bg-white/10 transition-all"
                title="Refresh Status"
                onClick={() => window.location.reload()}
              >
                <TrendingUp className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
            <div className="space-y-4">
              <PushNotificationSwitch />
              <div className="flex items-center gap-3 px-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-stone-950 bg-stone-800 overflow-hidden shadow-xl">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" className="w-full h-full object-cover grayscale opacity-50" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-bold text-stone-500 leading-tight">
                  <span className="text-stone-300">12 Mitra Online</span> sedang aktif di area ini.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isOnline) {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          toggleTherapistStatus(therapist.id);
                          showToast(`GPS Aktif (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}). Status Anda kini Online!`, 'success');
                        },
                        (error) => {
                          console.warn('GPS error:', error);
                          toggleTherapistStatus(therapist.id);
                          showToast('Peringatan: GPS tidak aktif. Status tetap Online.', 'success');
                        },
                        { timeout: 10000, enableHighAccuracy: true }
                      );
                    } else {
                      toggleTherapistStatus(therapist.id);
                      showToast('Status Anda kini Online', 'success');
                    }
                  } else {
                    toggleTherapistStatus(therapist.id);
                    showToast('Berhasil mematikan status (Offline)', 'success');
                  }
                }}
                className={`flex-1 py-6 rounded-[2rem] text-xs font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
                  isOnline
                    ? 'bg-emerald-500 text-white shadow-[0_20px_40px_-12px_rgba(16,185,129,0.4)] hover:bg-emerald-400'
                    : 'bg-white text-stone-900 shadow-[0_20px_40px_-12px_rgba(255,255,255,0.1)] hover:bg-stone-100'
                }`}
              >
                {isOnline ? <Power className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isOnline ? 'Matikan Status' : 'Aktifkan Status'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleBreak}
                className={`px-8 py-6 rounded-[2rem] border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  isBreak 
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-[0_20px_40px_-12px_rgba(251,191,36,0.4)] hover:bg-amber-300' 
                    : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
                title={isBreak ? 'Klik untuk mengakhiri waktu istirahat dan kembali online' : 'Klik untuk istirahat sementara'}
              >
                <Coffee className={`w-4 h-4 ${isBreak ? 'animate-bounce' : ''}`} />
                <span>{isBreak ? 'Selesai Istirahat' : 'Istirahat'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-2 bg-stone-100 rounded-[2rem] border border-stone-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'tugas', label: 'Tugas', icon: Briefcase },
          { id: 'jadwal', label: 'Jadwal', icon: Clock },
          { id: 'performa', label: 'Performa', icon: TrendingUp },
          { id: 'materi', label: 'Materi', icon: Target },
          { id: 'kit', label: 'Inventaris', icon: PackageCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[100px] py-4 px-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-stone-900 shadow-premium border border-stone-100' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-600' : 'text-stone-400'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tugas' && (
          <motion.div 
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Active Orders Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-3">
                <h2 className="text-2xl font-bold text-stone-900 font-serif-display flex items-center gap-3">
                  Tugas Aktif
                  <span className="px-3 py-1 bg-stone-900 text-white rounded-full text-[11px] font-black">
                    {activeOrders.length}
                  </span>
                </h2>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={triggerTestOrderAlert}
                    className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    title="Uji simulasi suara dering & modal pesanan masuk"
                  >
                    <BellRing className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                    <span>Uji Alert Masuk</span>
                  </motion.button>
                  <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-2xl border border-stone-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync
                  </div>
                </div>
              </div>

              {activeOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeOrders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    const therapistCommission = Math.round(order.servicePrice * therapist.commissionRate) + order.transportCost;

                    return (
                      <motion.div
                        layout
                        key={order.id}
                        className="bg-white rounded-[3rem] border border-stone-100 shadow-premium p-8 sm:p-10 space-y-8 relative overflow-hidden group hover:border-emerald-200 transition-all duration-500"
                      >
                        {order.status === 'in_session' && (
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                        )}

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.color}`}>
                                {badge.label}
                              </span>
                              <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">#{order.bookingCode}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-stone-900 font-serif-display leading-tight">{order.serviceTitle}</h3>
                            <div className="flex items-center gap-4 text-xs font-bold text-stone-500">
                              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-600" /> {order.durationMinutes} Menit</span>
                              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-600" /> {order.bookingTimeSlot} WIB</span>
                            </div>
                            {order.selectedAddOns && order.selectedAddOns.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1.5">
                                {order.selectedAddOns.map((addon, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                    {addon.name} (+Rp {addon.price.toLocaleString('id-ID')})
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center sm:text-right min-w-[140px]">
                            <div className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-1">Potensi Komisi</div>
                            <div className="text-2xl font-black text-emerald-900 tracking-tighter">
                              {formatRupiah(therapistCommission)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-stone-900">
                                <UserCheck className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Informasi Klien</div>
                                <div className="text-sm font-black text-stone-900">{order.customerName}</div>
                              </div>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-stone-100 space-y-1">
                              <div className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Catatan / Preferensi</div>
                              <p className="text-[10px] text-stone-600 font-medium leading-relaxed">
                                {order.customerName === 'Fahry Septian' ? 'Suka tekanan kuat di area pundak. Alergi minyak beraroma tajam.' : 'Tidak ada catatan khusus.'}
                              </p>
                            </div>
                          </div>

                          <div className="p-6 bg-stone-900 rounded-[2rem] space-y-4 group/addr relative overflow-hidden">
                            <div className="flex items-center justify-between relative z-10">
                              <div className="text-[9px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                Lokasi Pelayanan
                              </div>
                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  navigator.clipboard.writeText(`${order.address}, ${order.kecamatan}, ${order.city}`);
                                  showToast('Alamat disalin ke clipboard', 'success');
                                }}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5 text-stone-400" />
                              </motion.button>
                            </div>
                            <div className="text-xs font-bold text-stone-100 leading-relaxed pr-8 relative z-10">
                              {order.address}, {order.kecamatan}, {order.city}
                            </div>
                          </div>
                        </div>

                        {/* Upsell Section on Active Card */}
                        <div className="p-6 bg-gradient-to-r from-emerald-500/5 to-amber-500/5 rounded-[2rem] border border-emerald-100/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="space-y-1 text-center sm:text-left">
                            <div className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                              Tawarkan Tambahan Layanan
                            </div>
                            <div className="text-xs text-stone-500 font-semibold leading-relaxed">
                              Terapis dapat menambahkan layanan ekstra langsung di tempat untuk komisi lebih besar!
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedOrderForAddon(order.id)}
                            className="w-full sm:w-auto px-5 py-3.5 bg-white border border-stone-200 hover:border-emerald-500 hover:text-emerald-700 text-stone-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap"
                          >
                            <Plus className="w-4 h-4 text-emerald-600" />
                            <span>Tambah Layanan</span>
                          </motion.button>
                        </div>

                        {/* Active Session SOP Guide and Live Timer */}
                        {order.status === 'in_session' && (
                          <ActiveSessionGuide
                            orderId={order.id}
                            durationMinutes={order.durationMinutes}
                            customerName={order.customerName}
                            showToast={showToast}
                          />
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-50">
                          <div className="flex-1 flex gap-3">
                            <motion.a
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              href={`https://wa.me/62${order.customerPhone.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(order.customerName)},%20saya%20${encodeURIComponent(therapist.name)}%20mitra%20terapis%20Mimah Spa.%20Saya%20akan%20menuju%20lokasi%20Anda.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/20 transition-all"
                            >
                              <MessageCircle className="w-5 h-5 fill-white" />
                              <span>Hubungi Klien</span>
                            </motion.a>
                            <motion.a
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address + ' ' + order.kecamatan + ' ' + order.city)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-20 py-5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-[1.5rem] flex items-center justify-center transition-all border border-stone-200"
                            >
                              <Navigation className="w-5 h-5 text-emerald-600" />
                            </motion.a>
                          </div>

                          <div className="sm:w-2/3">
                            {order.status === 'confirmed' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateBookingStatus(order.id, 'therapist_on_the_way', `${therapist.name} dalam perjalanan`)}
                                className="w-full py-5 bg-stone-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-stone-900/20"
                              >
                                <Play className="w-5 h-5 text-emerald-500" />
                                <span>Berangkat Sekarang</span>
                              </motion.button>
                            )}

                            {order.status === 'therapist_on_the_way' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateBookingStatus(order.id, 'therapist_arrived', `Terapis sampai di lokasi`)}
                                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/20"
                              >
                                <MapPin className="w-5 h-5" />
                                <span>Konfirmasi Sampai</span>
                              </motion.button>
                            )}

                            {order.status === 'therapist_arrived' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateBookingStatus(order.id, 'in_session', `Sesi dimulai`)}
                                className="w-full py-5 bg-emerald-700 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/20"
                              >
                                <Sparkles className="w-5 h-5" />
                                <span>Mulai Sesi Terapi</span>
                              </motion.button>
                            )}

                            {order.status === 'in_session' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateBookingStatus(order.id, 'completed', `Sesi selesai`)}
                                className="w-full py-5 bg-stone-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl"
                              >
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span>Selesaikan Layanan</span>
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] border border-dashed border-stone-200 p-16 text-center space-y-6">
                  <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-10 h-10 text-stone-200" />
                  </div>
                  <div className="max-w-xs mx-auto space-y-2">
                    <h3 className="text-xl font-bold text-stone-900 font-serif-display">Tidak Ada Tugas Aktif</h3>
                    <p className="text-sm text-stone-500 font-medium leading-relaxed">
                      Status Anda aktif. Tetap standby untuk menerima panggilan layanan di area {therapist.baseCity}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'jadwal' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TherapistSchedule therapistId={therapist.id} />
          </motion.div>
        )}

        {activeTab === 'materi' && (
          <motion.div
            key="training"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-stone-900 font-serif-display">Pusat Pelatihan & SOP</h3>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Kuasai Teknik Mimah Spa untuk Hasil Terbaik</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Teknik Mimah Signature', dur: '12 Menit', cat: 'Video Tutorial', icon: Play },
                  { title: 'Protokol Kebersihan Alat', dur: '5 Halaman', cat: 'SOP Dasar', icon: ShieldCheck },
                  { title: 'Etika Komunikasi Klien', dur: '8 Menit', cat: 'Soft Skill', icon: MessageCircle },
                  { title: 'Penanganan Alergi Minyak', dur: '4 Halaman', cat: 'Keamanan', icon: AlertTriangle },
                ].map((materi, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <materi.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[8px] font-black text-stone-400 uppercase tracking-widest">{materi.cat}</div>
                        <div className="text-sm font-bold text-stone-900">{materi.title}</div>
                        <div className="text-[10px] text-stone-500 font-medium">{materi.dur}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-emerald-600 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'performa' && (
          <motion.div 
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Target Card */}
              <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-premium space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-stone-900 font-serif-display">Target Pendapatan</h3>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Progres Hari Ini</p>
                  </div>
                  <Target className="w-8 h-8 text-rose-500 opacity-20" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-4xl font-black text-stone-900 tracking-tighter">{Math.round(targetProgress)}%</div>
                      <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">On Track</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Goal</div>
                      <div className="text-lg font-black text-stone-900">1.0 JUTA</div>
                    </div>
                  </div>
                  
                  <div className="relative h-4 bg-stone-50 rounded-full overflow-hidden border border-stone-100 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${targetProgress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-soft space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Saldo Dompet</div>
                    <div className="text-lg font-black text-stone-900">{formatRupiah(currentEarnings)}</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-soft space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Sesi Selesai</div>
                    <div className="text-lg font-black text-stone-900">{therapist.completedOrders} Order</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-soft space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Nilai Mitra</div>
                    <div className="text-lg font-black text-stone-900">{therapist.rating} / 5.0</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-soft space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Jam Kerja</div>
                    <div className="text-lg font-black text-stone-900">{therapist.totalHours} Jam</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-premium space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-stone-900 font-serif-display">Pencapaian & Badge</h3>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Apresiasi Untuk Kinerja Terbaik Anda</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: '100_sessions', name: '100 Sesi Sempurna', icon: ShieldCheck, color: 'emerald', earned: therapist.completedOrders >= 100 },
                  { id: 'top_rated', name: 'Bintang 5 Melati', icon: Star, color: 'amber', earned: therapist.rating >= 4.8 },
                  { id: 'punctual', name: 'Tepat Waktu', icon: Clock, color: 'blue', earned: true },
                  { id: 'hygiene', name: 'Protokol Pro', icon: Sparkles, color: 'purple', earned: true },
                ].map((badge) => (
                  <div 
                    key={badge.id}
                    className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center text-center gap-3 ${
                      badge.earned 
                        ? `bg-${badge.color}-50 border-${badge.color}-100` 
                        : 'bg-stone-50 border-stone-100 opacity-40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                      badge.earned ? `bg-${badge.color === 'emerald' ? 'emerald-500' : badge.color === 'amber' ? 'amber-500' : badge.color === 'blue' ? 'blue-500' : 'purple-500'} text-white` : 'bg-stone-200 text-stone-400'
                    }`}>
                      <badge.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-stone-900 uppercase tracking-tight leading-tight">{badge.name}</div>
                      <div className={`text-[8px] font-bold uppercase mt-1 ${badge.earned ? `text-${badge.color === 'emerald' ? 'emerald-600' : badge.color === 'amber' ? 'amber-600' : badge.color === 'blue' ? 'blue-600' : 'purple-600'}` : 'text-stone-400'}`}>
                        {badge.earned ? 'Diperoleh' : 'Terkunci'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Cashout & Wallet Portal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Cashout Request Form */}
              <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-premium space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 font-serif-display">Pencairan Komisi Instan</h3>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Kirim langsung ke Rekening Anda</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Amount Preset Buttons */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Pilih atau Input Jumlah</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[100000, 200000, 500000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCashoutAmount(preset.toString())}
                          className={`py-3 rounded-xl text-xs font-black transition-all border ${
                            cashoutAmount === preset.toString()
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-stone-50 border-stone-100 hover:border-stone-200 text-stone-800'
                          }`}
                        >
                          Rp {preset.toLocaleString('id-ID')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Amount Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-stone-400">Rp</span>
                      <input
                        type="number"
                        placeholder="Jumlah Penarikan Lainnya"
                        value={cashoutAmount}
                        onChange={(e) => setCashoutAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Bank/E-Wallet Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Metode Transfer</label>
                      <select
                        value={cashoutBank}
                        onChange={(e) => setCashoutBank(e.target.value)}
                        className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
                      >
                        <option value="Bank BCA">Bank BCA</option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                        <option value="Bank BRI">Bank BRI</option>
                        <option value="GoPay">GoPay</option>
                        <option value="OVO">OVO</option>
                        <option value="Dana">Dana</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Nomor Rekening/E-Wallet</label>
                      <input
                        type="text"
                        placeholder="8021xxxx"
                        value={cashoutAccountNo}
                        onChange={(e) => setCashoutAccountNo(e.target.value)}
                        className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      placeholder="Miftah Nur Jannah"
                      value={cashoutAccountName}
                      onChange={(e) => setCashoutAccountName(e.target.value)}
                      className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const amount = parseFloat(cashoutAmount);
                      if (isNaN(amount) || amount <= 0) {
                        showToast('Masukkan jumlah penarikan yang valid', 'warning');
                        return;
                      }
                      if (!cashoutAccountNo) {
                        showToast('Masukkan nomor rekening tujuan', 'warning');
                        return;
                      }
                      if (!cashoutAccountName) {
                        showToast('Masukkan nama pemilik rekening', 'warning');
                        return;
                      }
                      requestCashout(therapist.id, amount, cashoutBank, cashoutAccountNo, cashoutAccountName);
                      // Clear form on success
                      setCashoutAmount('');
                      setCashoutAccountNo('');
                      setCashoutAccountName('');
                    }}
                    className="w-full py-5 bg-stone-900 hover:bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Ajukan Tarik Komisi</span>
                  </motion.button>
                </div>
              </div>

              {/* Cashout History Request List */}
              <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-premium flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 font-serif-display">Riwayat Pencairan</h3>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Status pengajuan Anda</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-stone-50 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {cashoutRequests.filter(r => r.therapistId === therapist.id).length} Transaksi
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 max-h-[380px] pr-2">
                  {cashoutRequests.filter(r => r.therapistId === therapist.id).length > 0 ? (
                    cashoutRequests
                      .filter(r => r.therapistId === therapist.id)
                      .map((req) => (
                        <div key={req.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-100/50 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="text-sm font-black text-stone-900">
                              Rp {req.amount.toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-stone-500 font-medium">
                              {req.paymentMethod} • {req.accountNo}
                            </div>
                            <div className="text-[9px] text-stone-400 font-bold">
                              {req.createdAt} • Pemilik: {req.accountName}
                            </div>
                          </div>
                          <div>
                            <span className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg ${
                              req.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {req.status === 'completed' ? 'Berhasil' : req.status === 'pending' ? 'Diproses' : 'Ditolak'}
                            </span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                      <AlertCircle className="w-8 h-8 text-stone-300" />
                      <div className="text-xs text-stone-500 font-bold">Belum ada riwayat penarikan komisi.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'kit' && (
          <motion.div 
            key="kit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[3rem] border border-stone-100 shadow-premium overflow-hidden">
              <div className="p-8 border-b border-stone-50 bg-stone-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center">
                    <PackageCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 font-serif-display">Pemeriksaan Inventaris</h3>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Wajib dicek sebelum berangkat</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                  Lengkap
                </div>
              </div>
              
              <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {therapist.assignedInventory?.map((item) => (
                  <div key={item.itemId} className="p-5 bg-stone-50 rounded-3xl border border-stone-100/50 flex items-center justify-between group hover:bg-white hover:border-emerald-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 group-hover:text-emerald-600 transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-stone-900">{item.name}</div>
                        <div className="text-[10px] text-stone-500 font-medium uppercase tracking-tight">Kondisi: {item.condition}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black text-stone-900 bg-white px-4 py-2 rounded-xl border border-stone-100 shadow-sm">
                      {item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Access Actions Overlay */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40 bg-white/85 backdrop-blur-xl px-5 py-3 rounded-full border border-stone-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open('https://wa.me/6281289214411', '_blank')}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-md"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span className="hidden md:inline">Hubungi CS Mimah</span>
          <span className="md:hidden">CS</span>
        </motion.button>
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (confirm('Keluar dari portal terapis?')) logout();
          }}
          className="px-6 py-3.5 bg-stone-900 hover:bg-rose-600 text-white hover:text-white rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-md"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span className="hidden md:inline">Keluar Portal</span>
          <span className="md:hidden">Keluar</span>
        </motion.button>
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            showToast('⚠️ SOS Aktif! CS Mimah sedang melacak GPS Anda & menghubungi nomor telepon Anda.', 'error');
          }}
          className="w-12 h-12 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center transition-all shadow-md"
        >
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </motion.button>
      </div>

      {/* Upsell Add-On Modal */}
      <AnimatePresence>
        {selectedOrderForAddon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl border border-stone-100 max-w-lg w-full overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 font-serif-display">Tambah Layanan</h3>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Sesi langsung di tempat</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrderForAddon(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors font-black text-[10px] uppercase tracking-widest"
                >
                  Tutup
                </button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
                <p className="text-xs text-stone-500 font-medium leading-relaxed mb-4">
                  Silakan tawarkan layanan tambahan berikut kepada klien. Tekan <b>+ Tambah</b> untuk langsung memperbarui durasi dan komisi Anda.
                </p>
                {addOns.map((addon) => {
                  const targetBooking = bookings.find(b => b.id === selectedOrderForAddon);
                  const isAdded = targetBooking?.selectedAddOns.some(item => item.id === addon.id);

                  return (
                    <div
                      key={addon.id}
                      className={`p-5 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                        isAdded 
                          ? 'bg-stone-50 border-stone-200 opacity-60' 
                          : 'bg-white border-stone-100 hover:border-emerald-200 hover:shadow-soft'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-stone-900">{addon.name}</div>
                        <div className="text-[11px] text-stone-500 leading-relaxed font-medium">{addon.description}</div>
                        <div className="flex items-center gap-3 pt-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                          <span>Rp {addon.price.toLocaleString('id-ID')}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                          <span>+{addon.durationMinutes} Menit</span>
                        </div>
                      </div>
                      <button
                        disabled={isAdded}
                        onClick={() => {
                          addAddonToBooking(selectedOrderForAddon, addon.id);
                          setSelectedOrderForAddon(null);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                          isAdded
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-stone-900 hover:bg-emerald-600 text-white shadow-md'
                        }`}
                      >
                        {isAdded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isAdded ? 'Sudah' : 'Tambah'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Incoming Order Ringtone & Dispatch Modal */}
      <IncomingOrderAlertModal
        order={incomingOrderAlert}
        therapist={therapist}
        isOpen={!!incomingOrderAlert}
        onAccept={handleAcceptIncomingOrder}
        onDecline={handleDeclineIncomingOrder}
        onClose={() => setIncomingOrderAlert(null)}
      />

    </div>
  );
};
