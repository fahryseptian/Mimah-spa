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
    <div className="bg-white/5 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 flex items-center justify-between gap-4 transition-all hover:bg-white/10">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${permission === 'granted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-stone-500'}`}>
          {permission === 'granted' ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-white uppercase tracking-wider">Notifikasi Pesanan</span>
          <span className="text-[10px] text-stone-400 leading-tight">
            {permission === 'granted' ? 'Otomatis berdering' : 'Aktifkan agar order masuk'}
          </span>
        </div>
      </div>
      <button
        onClick={requestPermission}
        disabled={permission === 'granted'}
        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
          permission === 'granted' 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 active:scale-95'
        }`}
      >
        {permission === 'granted' ? 'Aktif' : 'Aktifkan'}
      </button>
    </div>
  );
};
