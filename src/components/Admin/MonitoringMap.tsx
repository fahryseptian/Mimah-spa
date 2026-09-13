import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  User, 
  Phone, 
  MoreVertical,
  Activity,
  ArrowUpRight,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

export const MonitoringMap: React.FC = () => {
  const { therapists, sosAlerts, resolveSOSAlert } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'sos' | 'active'>('all');

  const activeSos = sosAlerts.filter(a => a.status === 'active');
  const activeTherapists = therapists.filter(t => t.status === 'online');

  const filteredTherapists = activeTab === 'sos' 
    ? therapists.filter(t => activeSos.some(a => a.therapistId === t.id))
    : activeTab === 'active' 
      ? activeTherapists
      : therapists;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-stone-900 font-serif-display">Monitoring Lapangan Real-Time</h3>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Pantau Keamanan & Posisi Mitra Aktif</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'all' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-100 hover:bg-stone-50'}`}
          >
            Semua Mitra
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-white text-stone-500 border-stone-100'}`}
          >
            Sedang Bertugas ({activeTherapists.length})
          </button>
          <button 
            onClick={() => setActiveTab('sos')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'sos' ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse' : 'bg-white text-stone-500 border-stone-100'}`}
          >
            Sinyal Darurat SOS ({activeSos.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Simulated Map View / Visual Monitor */}
        <div className="lg:col-span-8 bg-stone-100 rounded-[3rem] border border-stone-200 shadow-inner relative overflow-hidden h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>

          {/* SOS Signal Illustration */}
          {activeSos.map((sos, idx) => (
            <motion.div
              key={sos.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute flex flex-col items-center gap-2"
              style={{ top: `${30 + idx * 20}%`, left: `${40 + idx * 10}%` }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20" />
                <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-2xl relative z-10">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-xl border border-rose-100 text-[10px] font-black text-rose-600 uppercase tracking-widest">
                SOS: {sos.therapistName}
              </div>
            </motion.div>
          ))}

          {/* Online Therapist Pins */}
          {!activeSos.length && activeTherapists.slice(0, 5).map((t, idx) => (
            <motion.div
              key={t.id}
              className="absolute flex flex-col items-center gap-2"
              style={{ top: `${20 + idx * 15}%`, left: `${20 + idx * 12}%` }}
              whileHover={{ scale: 1.1, zIndex: 50 }}
            >
              <div className="w-12 h-12 bg-white rounded-2xl p-1 shadow-xl border border-emerald-100 cursor-pointer">
                <img src={t.photoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="bg-white px-2 py-1 rounded-md shadow-lg border border-stone-100 text-[8px] font-bold text-stone-900 whitespace-nowrap">
                {t.name}
              </div>
            </motion.div>
          ))}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/80 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-white/50 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm" />
              <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Aktif Sesi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-sm" />
              <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Sinyal SOS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-stone-300 rounded-full shadow-sm" />
              <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Menunggu Order</span>
            </div>
          </div>
        </div>

        {/* Sidebar Status List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-premium">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Status Lapangan Terakhir</h4>
            <div className="space-y-4 max-h-[480px] overflow-y-auto no-scrollbar pr-2">
              {activeSos.length > 0 ? activeSos.map(sos => (
                <div key={sos.id} className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-rose-900 uppercase">{sos.therapistName}</div>
                        <div className="text-[9px] text-rose-600 font-bold">{sos.timestamp}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-white/50 rounded-xl text-[10px] text-rose-700 font-medium leading-relaxed italic border border-rose-100">
                    "{sos.locationAddress}"
                  </div>
                  <button 
                    onClick={() => resolveSOSAlert(sos.id)}
                    className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/20 hover:bg-rose-700 transition-all"
                  >
                    Tandai Masalah Selesai
                  </button>
                </div>
              )) : (
                filteredTherapists.slice(0, 10).map(t => (
                  <div key={t.id} className="p-4 bg-stone-50/50 rounded-2xl border border-stone-100 flex items-center justify-between group hover:border-emerald-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                        <img src={t.photoUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-stone-900 uppercase">{t.name}</div>
                        <div className="flex items-center gap-1.5 text-[8px] text-stone-400 font-medium uppercase tracking-tighter">
                          <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                          {t.baseKecamatan}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${t.status === 'online' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                        {t.status}
                      </div>
                      <div className="text-[8px] text-stone-400 font-medium mt-1">Sesi: {t.completedOrders}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-stone-900 p-8 rounded-[2.5rem] text-white shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-sm font-bold">Protokol Keamanan</h5>
                <p className="text-[10px] text-stone-400 font-medium">Monitoring diaktifkan 24/7</p>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 leading-relaxed font-medium">Sistem SOS akan mengirimkan notifikasi instan ke WhatsApp Admin utama dan Dashboard Monitoring jika mitra memicu sinyal darurat dari aplikasi mereka.</p>
            <button className="w-full py-4 bg-stone-800 text-stone-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-stone-700 hover:bg-stone-700 transition-all flex items-center justify-center gap-2">
              Unduh Laporan Harian SOS
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
