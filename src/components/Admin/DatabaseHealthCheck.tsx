import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Database, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  ShieldCheck, 
  Users, 
  Calendar,
  AlertTriangle,
  Server,
  Key
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

interface TableHealth {
  name: string;
  count: number | null;
  status: 'ok' | 'error' | 'checking';
  error?: string;
}

export const DatabaseHealthCheck: React.FC = () => {
  const { isDbConnected } = useApp();
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [tables, setTables] = useState<TableHealth[]>([
    { name: 'bookings', count: null, status: 'checking' },
    { name: 'therapists', count: null, status: 'checking' },
    { name: 'services', count: null, status: 'checking' },
    { name: 'vouchers', count: null, status: 'checking' }
  ]);

  const checkHealth = async () => {
    if (!supabase) {
      setTables(prev => prev.map(t => ({ ...t, status: 'error', error: 'Supabase client not initialized' })));
      return;
    }

    setChecking(true);
    const newTables: TableHealth[] = [];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true });

        if (error) {
          newTables.push({
            name: table.name,
            count: null,
            status: 'error',
            error: error.message
          });
        } else {
          newTables.push({
            name: table.name,
            count: count || 0,
            status: 'ok'
          });
        }
      } catch (e: any) {
        newTables.push({
          name: table.name,
          count: null,
          status: 'error',
          error: e.message
        });
      }
    }

    setTables(newTables);
    setChecking(false);
    setLastCheck(new Date().toLocaleTimeString('id-ID'));
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const maskedUrl = import.meta.env.VITE_SUPABASE_URL 
    ? `${import.meta.env.VITE_SUPABASE_URL.substring(0, 15)}...` 
    : 'Not Set';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isDbConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Activity className={`w-6 h-6 ${checking ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-display">System Health Monitor</h2>
              <p className="text-xs text-stone-500 font-medium">Status koneksi real-time ke infrastruktur cloud</p>
            </div>
          </div>
          <button 
            onClick={checkHealth}
            disabled={checking}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking...' : 'Refresh Status'}</span>
          </button>
        </div>

        {/* Global Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <Server className="w-4 h-4 text-stone-400" />
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">Client Status</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDbConnected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )}
                <span className={`text-sm font-bold ${isDbConnected ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isDbConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="text-[10px] font-mono text-stone-400 bg-white px-2 py-1 rounded-lg border border-stone-100">
                {maskedUrl}
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <Key className="w-4 h-4 text-stone-400" />
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">Authentication</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${supabase?.auth ? 'text-emerald-500' : 'text-stone-300'}`} />
                <span className="text-sm font-bold text-stone-700">
                  {supabase?.auth ? 'Auth Ready' : 'Auth Not Initialized'}
                </span>
              </div>
              <div className="text-[10px] font-black text-stone-400 uppercase">
                Last Sync: {lastCheck || 'Never'}
              </div>
            </div>
          </div>
        </div>

        {/* Table Health List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-stone-400" />
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">Table Integrity Check</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tables.map((table) => (
              <motion.div 
                key={table.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border transition-all ${
                  table.status === 'ok' 
                    ? 'bg-white border-stone-100 hover:border-emerald-200' 
                    : table.status === 'error'
                      ? 'bg-rose-50 border-rose-100'
                      : 'bg-stone-50 border-stone-100 animate-pulse'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {table.name === 'bookings' && <Calendar className="w-3.5 h-3.5 text-stone-400" />}
                    {table.name === 'therapists' && <Users className="w-3.5 h-3.5 text-stone-400" />}
                    <span className="text-xs font-black text-stone-900 uppercase tracking-tight">{table.name}</span>
                  </div>
                  {table.status === 'ok' && (
                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase">
                      Live
                    </div>
                  )}
                  {table.status === 'error' && (
                    <div className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black rounded-full uppercase">
                      Failed
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-2xl font-black text-stone-900">
                    {table.status === 'checking' ? '...' : table.count ?? 0}
                    <span className="text-[10px] font-bold text-stone-400 ml-1 uppercase">Records</span>
                  </div>
                  {table.status === 'error' && (
                    <div className="group relative">
                      <AlertTriangle className="w-4 h-4 text-rose-500 cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 scale-0 group-hover:scale-100 transition-all origin-bottom-right bg-stone-900 p-2 rounded-lg text-[9px] text-white normal-case shadow-xl">
                        {table.error}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {!isDbConnected && (
          <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900 mb-1">Peringatan: Kunci API Belum Terpasang</p>
              <p className="text-[10px] text-amber-800/70 leading-relaxed">
                Anda saat ini berada dalam <strong>Mock Mode</strong>. Untuk menghubungkan aplikasi ke database Supabase sungguhan, masukkan URL dan Anon Key di menu Settings proyek AI Studio Anda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
