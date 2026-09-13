import React, { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';

export const PushNotificationSwitch: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser ini tidak mendukung notifikasi push.');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification('Notifikasi Aktif!', {
          body: 'Anda akan menerima pemberitahuan setiap ada pesanan masuk.',
          icon: '/icon.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return (
    <div className="bg-stone-800/80 p-3 sm:p-4 rounded-2xl border border-stone-100 shadow-soft flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${permission === 'granted' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-stone-700 text-stone-600'}`}>
          {permission === 'granted' ? <BellRing className="w-5 h-5 animate-pulse" /> : <BellOff className="w-5 h-5" />}
        </div>
        <div>
          <div className="text-sm font-bold text-white">Notifikasi Pesanan Masuk</div>
          <div className="text-[10px] sm:text-xs text-stone-600">
            {permission === 'granted' ? 'Notifikasi aktif. Anda akan berdering saat ada order.' : 'Aktifkan notifikasi untuk order baru.'}
          </div>
        </div>
      </div>
      <button
        onClick={requestPermission}
        disabled={permission === 'granted'}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
          permission === 'granted' 
            ? 'bg-emerald-50/50 border border-emerald-800 text-emerald-500 cursor-default' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-hover shadow-emerald-900/20 active:scale-95 cursor-pointer'
        }`}
      >
        {permission === 'granted' ? 'Aktif' : 'Aktifkan'}
      </button>
    </div>
  );
};
