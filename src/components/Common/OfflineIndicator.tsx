import React, { useEffect, useState } from 'react';
import { CloudOff, Database, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { isDbConnected } = useApp();
  const isConfigured = isSupabaseConfigured();

  // If connected or configured with Supabase, hide the mock indicator
  if (isOnline && (isDbConnected || isConfigured)) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {!isOnline && (
        <div className="flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl animate-pulse border border-amber-500">
          <CloudOff className="w-3 h-3" />
          <span>Koneksi Internet Terputus</span>
        </div>
      )}
      {!isDbConnected && isOnline && (
        <div className="flex items-center gap-2 rounded-2xl bg-stone-900 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl border border-stone-800">
          <Database className="w-3 h-3 text-rose-500" />
          <span className="text-stone-300">Database: </span>
          <span className="text-rose-400">Offline (Mock Mode)</span>
          <div className="group relative ml-1">
            <AlertTriangle className="w-3 h-3 text-amber-500 cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 w-48 scale-0 group-hover:scale-100 transition-all origin-bottom-left bg-stone-800 p-2 rounded-lg text-[9px] text-stone-400 normal-case tracking-normal shadow-2xl border border-stone-700">
              Silakan masukkan Supabase URL & Key di menu Settings untuk mengaktifkan database asli.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
