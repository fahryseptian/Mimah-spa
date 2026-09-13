import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Droplet, 
  Flame, 
  Coffee, 
  Compass,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActiveSessionGuideProps {
  orderId: string;
  durationMinutes: number;
  customerName: string;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface SopItem {
  id: string;
  label: string;
  desc: string;
  icon: any;
}

export const ActiveSessionGuide: React.FC<ActiveSessionGuideProps> = ({
  orderId,
  durationMinutes,
  customerName,
  showToast
}) => {
  // Timer States
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [isActive, setIsActive] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // For quick demo

  // SOP Checklist States
  const [sopChecked, setSopChecked] = useState<Record<string, boolean>>({
    sanitation: false,
    ambience: false,
    consultation: false,
    massage: false,
    tea: false,
  });

  const sopList: SopItem[] = [
    {
      id: 'sanitation',
      label: 'Sanitasi & Sterilisasi',
      desc: 'Bersihkan tangan terapis dengan antiseptik & semprot linen dengan disinfektan di depan klien.',
      icon: Droplet
    },
    {
      id: 'ambience',
      label: 'Atur Suasana Kamar',
      desc: 'Nyalakan lilin aromaterapi lavender hangat & putar musik relaksasi instrumental Mimah.',
      icon: Flame
    },
    {
      id: 'consultation',
      label: 'Konfirmasi Preferensi',
      desc: 'Tanyakan area tubuh yang butuh fokus pijatan (misal: pundak pegal) atau bagian cedera.',
      icon: Compass
    },
    {
      id: 'massage',
      label: 'Inti Treatment',
      desc: 'Lakukan terapi pijatan tradisional berkualitas bintang lima dengan sepenuh hati.',
      icon: Sparkles
    },
    {
      id: 'tea',
      label: 'Seduh Teh Herbal',
      desc: 'Sajikan secangkir jahe merah hangat pasca-treatment untuk mengembalikan kebugaran klien.',
      icon: Coffee
    }
  ];

  // Tick effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => Math.max(0, prev - (1 * speedMultiplier)));
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      showToast(`Sesi terapi untuk Ibu ${customerName} telah selesai! Berikan teh hangat.`, 'success');
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, speedMultiplier, customerName, showToast]);

  const toggleSop = (id: string) => {
    setSopChecked(prev => {
      const nextVal = !prev[id];
      if (nextVal) {
        showToast(`Langkah SOP: ${sopList.find(s => s.id === id)?.label} Berhasil Diselesaikan`, 'success');
      }
      return { ...prev, [id]: nextVal };
    });
  };

  // Time formatter
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs > 0 ? hrs.toString().padStart(2, '0') : null,
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const progressPercent = ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100;

  return (
    <div className="p-6 sm:p-8 bg-stone-50 border border-stone-200/80 rounded-[2.5rem] space-y-6 relative overflow-hidden">
      {/* Decorative pulse blur when timer active */}
      {isActive && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] animate-pulse pointer-events-none" />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-black tracking-widest uppercase text-stone-700">Live Treatment Companion</span>
        </div>
        <div className="flex items-center gap-2">
          {speedMultiplier > 1 && (
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 text-[8px] font-black uppercase rounded-lg animate-bounce flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
              Demo: Speed {speedMultiplier}x
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Interactive Timer Block (Left) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-white border border-stone-100 shadow-sm rounded-3xl space-y-4">
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* SVG Ring Background & Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="text-stone-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className="text-emerald-600 transition-all duration-300"
                strokeWidth="8"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * progressPercent) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Centered Timer Value */}
            <div className="absolute text-center">
              <div className="text-2xl font-black text-stone-900 font-mono tracking-tight">
                {formatTime(secondsLeft)}
              </div>
              <div className="text-[8px] font-black text-stone-400 uppercase tracking-widest mt-0.5">
                {secondsLeft > 0 ? 'Sisa Durasi' : 'Waktu Habis'}
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-2.5 rounded-xl border transition-all ${
                isActive 
                  ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
              title={isActive ? 'Jeda Sesi' : 'Lanjutkan Sesi'}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-600" />}
            </button>
            <button
              onClick={() => {
                setSecondsLeft(durationMinutes * 60);
                setIsActive(false);
                showToast('Timer disetel ulang', 'info');
              }}
              className="p-2.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Quick Speedup (For App Demo testing) */}
            <button
              onClick={() => {
                const nextSpeed = speedMultiplier === 1 ? 10 : speedMultiplier === 10 ? 60 : 1;
                setSpeedMultiplier(nextSpeed);
                showToast(`Mode Simulator: Kecepatan timer diatur ke ${nextSpeed}x`, 'info');
              }}
              className={`px-3 py-2 border rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                speedMultiplier > 1 
                  ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-900/10' 
                  : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
              }`}
              title="Percepat Timer untuk Demo"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{speedMultiplier === 1 ? 'Demo' : `${speedMultiplier}x`}</span>
            </button>
          </div>
        </div>

        {/* SOP Checklist (Right) */}
        <div className="md:col-span-7 space-y-3.5">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider">Mimah Spa 5-Step SOP Checklist</h4>
            <p className="text-[10px] text-stone-500 font-semibold">Terapis wajib mencentang setiap tahap sesuai instruksi standar pelayanan bintang lima:</p>
          </div>

          <div className="space-y-2.5">
            {sopList.map((sop) => {
              const CheckedIcon = sop.icon;
              const isChecked = sopChecked[sop.id];
              return (
                <button
                  key={sop.id}
                  onClick={() => toggleSop(sop.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    isChecked 
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-xs' 
                      : 'bg-white border-stone-100 hover:border-stone-200 shadow-xs'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    isChecked 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-stone-300'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-white fill-emerald-600 stroke-2" />}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <CheckedIcon className={`w-3.5 h-3.5 ${isChecked ? 'text-emerald-700' : 'text-stone-400'}`} />
                      <span className={`text-[11px] font-black ${isChecked ? 'text-emerald-900 line-through' : 'text-stone-800'}`}>
                        {sop.label}
                      </span>
                    </div>
                    <p className={`text-[9px] leading-normal font-semibold ${isChecked ? 'text-emerald-700/70' : 'text-stone-400'}`}>
                      {sop.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
