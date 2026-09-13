import React from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { selectedCity, whatsappNumber } = useApp();

  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin Mimah Spa, saya ingin reservasi/konsultasi layanan terapis panggilan ke rumah di wilayah ${selectedCity}.`
  )}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-soft-hover shadow-emerald-950/40 hover:scale-105 transition-all group border-2 border-emerald-400/50 cursor-pointer"
      title="Chat WhatsApp Resmi Mimah Spa"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
      </div>
      <div className="text-left hidden sm:block">
        <div className="text-[10px] text-emerald-800 uppercase font-bold leading-none">Bantuan Cepat</div>
        <div className="text-xs font-bold leading-tight">Chat WhatsApp</div>
      </div>
    </a>
  );
};
