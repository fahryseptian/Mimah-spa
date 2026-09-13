import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Sparkles, X, Smartphone } from 'lucide-react';

export const InstallPwaOverlay: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
    setIsMobileDevice(checkMobile);

    // Check if previously dismissed in this session
    const hasDismissed = sessionStorage.getItem('mimah_pwa_dismissed');
    if (hasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('mimah_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else if (isInstallable) {
      await install();
    } else {
      // Fallback modal or prompt if beforeinstallprompt hasn't fired yet
      setShowIOSModal(true);
    }
  };

  // Do not show if installed or dismissed
  if (isInstalled || dismissed || !isMobileDevice) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Banner / Overlay for Mobile */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto animate-bounce-slow">
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>Aplikasi Mimah Spa</span>
            </div>
            <p className="text-xs font-medium text-stone-200 truncate">
              Install aplikasi ke Layar Utama untuk akses lebih cepat & praktis!
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition-colors"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS / General Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-4 text-stone-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-serif-display">Install Mimah Spa</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 font-medium">
              <p>Nikmati kemudahan booking spa langganan langsung dari Layar Utama HP Anda seperti aplikasi native:</p>
              
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                <p className="font-bold text-emerald-900">📱 Panduan Cepat:</p>
                <ol className="list-decimal list-inside space-y-1 text-emerald-800">
                  <li>Ketuk ikon menu browser (ikon <span className="font-bold">Titik Tiga</span> atau <span className="font-bold">Share</span>).</li>
                  <li>Pilih opsi <span className="font-bold">"Add to Home Screen"</span> atau <span className="font-bold">"Install App"</span>.</li>
                  <li>Konfirmasi penambahan dan aplikasi siap digunakan!</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-all"
            >
                Mengerti & Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
