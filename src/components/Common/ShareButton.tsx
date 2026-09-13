import React from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ className = '' }) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Mimah Spa - Layanan Home Service Spa & Pijat Profesional',
      text: 'Cobain Mimah Spa! Layanan pijat & spa profesional yang bisa dipanggil langsung ke rumah di area Medan dan sekitarnya. Yuk pesan sekarang!',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Tautan layanan berhasil disalin ke clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-sm font-semibold transition-all border border-stone-200 shadow-sm active:scale-[0.98] cursor-pointer ${className}`}
      title="Bagikan layanan Mimah Spa"
    >
      <Share2 className="w-4 h-4" />
      <span>Bagikan</span>
    </button>
  );
};
