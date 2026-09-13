import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  ArrowRight,
  RefreshCcw,
  Sparkles,
  Smartphone,
  Server,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, BookingItem } from '../../types';

export const UATSimulator: React.FC = () => {
  const { 
    bookings, 
    createBooking, 
    updateBookingStatus, 
    therapists, 
    services, 
    showToast,
    userPoints,
    activeAdminTab,
    isDbConnected
  } = useApp();

  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [testBooking, setTestBooking] = useState<BookingItem | null>(null);
  const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'success' | 'warning' }[]>([]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString('id-ID'), msg, type }, ...prev]);
  };

  const steps = [
    { title: 'Create Order', desc: 'Pelanggan memesan layanan Royal Heritage Signature', icon: FileText },
    { title: 'Confirmation', desc: 'Admin menugaskan mitra terapis ke lokasi', icon: ShieldCheck },
    { title: 'In-Transit', desc: 'Terapis sedang dalam perjalanan (OTW)', icon: MapPin },
    { title: 'Arrived', desc: 'Terapis tiba dan memulai verifikasi identitas', icon: CheckCircle2 },
    { title: 'Treatment', desc: 'Sesi pemijatan sedang berlangsung', icon: Clock },
    { title: 'Completion', desc: 'Sesi selesai, poin diberikan & komisi dihitung', icon: Sparkles },
  ];

  const resetSim = () => {
    setSimStatus('idle');
    setCurrentStep(0);
    setTestBooking(null);
    setLogs([]);
  };

  const startSimulation = async () => {
    resetSim();
    setSimStatus('running');
    addLog('Memulai simulasi UAT End-to-End...', 'info');

    // STEP 1: Create Order
    setCurrentStep(0);
    addLog('Simulasi Pelanggan: Memilih layanan Royal Heritage...', 'info');
    
    const newBooking = createBooking({
      serviceId: services[0].id,
      serviceTitle: services[0].title,
      customerName: 'Test User UAT',
      customerPhone: '081234567890',
      customerGender: 'female',
      bookingDate: new Date().toLocaleDateString('id-ID'),
      bookingTimeSlot: '14:00',
      address: 'Jl. Simulator No. 123, Medan',
      city: 'Kota Medan',
      kecamatan: 'Medan Baru',
      placeType: 'rumah',
      paymentMethod: 'qris'
    });

    setTestBooking(newBooking);
    addLog(`Pesanan #${newBooking.bookingCode} berhasil dibuat oleh Pelanggan.`, 'success');

    await new Promise(r => setTimeout(r, 2000));

    // STEP 2: Confirmation
    setCurrentStep(1);
    addLog('Simulasi Admin: Menugaskan Terapis...', 'info');
    updateBookingStatus(newBooking.id, 'confirmed');
    addLog(`Admin telah mengonfirmasi pesanan & menugaskan Terapis ${therapists[0].name}.`, 'success');

    await new Promise(r => setTimeout(r, 2000));

    // STEP 3: OTW
    setCurrentStep(2);
    addLog('Simulasi Terapis: Mengubah status ke OTW...', 'info');
    updateBookingStatus(newBooking.id, 'therapist_on_the_way');
    addLog('Terapis sedang menuju lokasi pelanggan.', 'success');

    await new Promise(r => setTimeout(r, 2000));

    // STEP 4: Arrived
    setCurrentStep(3);
    addLog('Simulasi Terapis: Tiba di lokasi...', 'info');
    updateBookingStatus(newBooking.id, 'therapist_arrived');
    addLog('Terapis telah sampai. Notifikasi WA dikirim ke pelanggan.', 'success');

    await new Promise(r => setTimeout(r, 2000));

    // STEP 5: In Session
    setCurrentStep(4);
    addLog('Simulasi Terapis: Memulai sesi...', 'info');
    updateBookingStatus(newBooking.id, 'in_session');
    addLog('Sesi pemijatan sedang berlangsung secara real-time.', 'success');

    await new Promise(r => setTimeout(r, 3000));

    // STEP 6: Complete
    setCurrentStep(5);
    addLog('Simulasi Terapis: Sesi Selesai...', 'info');
    updateBookingStatus(newBooking.id, 'completed');
    addLog('Sesi selesai! Poin loyalty ditambahkan otomatis ke pelanggan.', 'success');
    addLog('Komisi mitra terapis telah diupdate di buku besar.', 'success');

    setSimStatus('completed');
    showToast('Simulasi UAT Berhasil Diselesaikan!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold font-serif-display">UAT Simulator (End-to-End)</h2>
            <p className="text-xs text-stone-500 font-medium">Uji integrasi sinkronisasi antara Pelanggan, Terapis, dan Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={resetSim}
              className="p-2.5 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-xl transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button
              disabled={simStatus === 'running'}
              onClick={startSimulation}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2.5 transition-all shadow-lg ${
                simStatus === 'running' 
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none' 
                  : 'bg-stone-900 text-white hover:bg-stone-800 shadow-stone-900/20 active:scale-95'
              }`}
            >
              <Zap className={simStatus === 'running' ? 'animate-pulse' : ''} />
              <span>{simStatus === 'running' ? 'Simulasi Berjalan...' : 'Mulai Simulasi Full'}</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="relative mb-12">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-100 -translate-y-1/2" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 transition-all duration-700" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          <div className="relative z-10 flex justify-between">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep || simStatus === 'completed';
              const isActive = idx === currentStep && simStatus === 'running';

              return (
                <div key={idx} className="flex flex-col items-center text-center max-w-[100px]">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-100 text-white' 
                      : isActive 
                        ? 'bg-white border-stone-900 text-stone-900 scale-110 shadow-xl' 
                        : 'bg-white border-stone-100 text-stone-300'
                  }`}>
                    <step.icon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                  </div>
                  <div className="mt-3">
                    <div className={`text-[9px] font-black uppercase tracking-tighter ${
                      isCompleted ? 'text-emerald-600' : isActive ? 'text-stone-900' : 'text-stone-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Split View: Live Logs & System State */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logs Section */}
          <div className="bg-stone-900 rounded-3xl p-5 h-[300px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-stone-800 pb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Real-time System Logs</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar font-mono">
              <AnimatePresence initial={false}>
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-stone-600 text-[10px] italic">
                    Belum ada aktivitas simulasi...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] leading-relaxed"
                    >
                      <span className="text-stone-600 mr-2">[{log.time}]</span>
                      <span className={
                        log.type === 'success' ? 'text-emerald-400' : 
                        log.type === 'warning' ? 'text-amber-400' : 'text-stone-300'
                      }>
                        {log.msg}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* State Audit Section */}
          <div className="bg-stone-50 rounded-3xl p-5 border border-stone-200/60">
            <div className="flex items-center gap-2 mb-4 border-b border-stone-200 pb-3">
              <Smartphone className="w-4 h-4 text-stone-500" />
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">System Auditor</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isDbConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <Server className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-black text-stone-600 uppercase">Database Engine</div>
                </div>
                <div className={`text-[10px] font-black uppercase ${isDbConnected ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isDbConnected ? 'Supabase Live' : 'Mock (LocalStorage)'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-black text-stone-600 uppercase">Customer Loyalty</div>
                </div>
                <div className="text-xs font-black text-amber-600">
                  {userPoints.toLocaleString('id-ID')} Poin
                </div>
              </div>

              {testBooking && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100"
                >
                  <div className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2">Live Booking State</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-emerald-900/60 uppercase">Order ID</div>
                      <div className="text-xs font-black text-emerald-900">#{testBooking.bookingCode}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-emerald-900/60 uppercase">Current Status</div>
                      <div className="inline-flex px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase">
                        {testBooking.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {simStatus === 'completed' && (
                <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500 shadow-xl shadow-emerald-900/5">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-black uppercase italic">Simulasi Sukses!</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Skenario E2E berhasil memvalidasi sinkronisasi data Supabase, perhitungan keuangan, dan update poin loyalitas pelanggan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-600 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-black text-amber-900 uppercase tracking-wider mb-1">Catatan UAT</h4>
          <p className="text-xs text-amber-800/80 leading-relaxed">
            Simulator ini menggunakan database real-time. Pesanan yang dibuat akan muncul di <strong>Log Transaksi</strong> dan <strong>Dashboard Utama</strong> secara otomatis. Harap hapus pesanan test setelah pengujian selesai.
          </p>
        </div>
      </div>
    </div>
  );
};
