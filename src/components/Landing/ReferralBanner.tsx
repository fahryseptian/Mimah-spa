import React from 'react';
import { Share2, Gift, Copy, Check, Sparkles, UserPlus } from 'lucide-react';
import { useState } from 'react';

export const ReferralBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'MIMAH-RI78';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12">
      <div className="relative rounded-[3rem] bg-stone-900 overflow-hidden shadow-premium group">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-600/20 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:opacity-40 transition-opacity duration-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 sm:p-20 gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-emerald-500/20">
              <UserPlus className="w-4 h-4" />
              <span>Referral Program</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold text-white font-serif-display leading-[1.1] tracking-tight">
              Bagikan Ketenangan,<br />
              <span className="text-emerald-500">Dapatkan Reward.</span>
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed max-w-xl font-medium">
              Ajak temanmu merasakan kemewahan Mimah Spa. Dapatkan <span className="text-white font-bold">5.000 Points</span> dan temanmu akan menerima diskon eksklusif 10% untuk pemesanan pertamanya!
            </p>
          </div>

          <div className="w-full lg:w-auto bg-white/5 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center gap-8 relative">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400 rounded-2xl flex items-center justify-center rotate-12 shadow-lg shadow-amber-400/20">
              <Gift className="w-10 h-10 text-stone-900" />
            </div>

            <div className="text-center space-y-4">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Kode Unik Kamu</p>
              <div className="text-4xl font-black text-white tracking-[0.2em] font-mono bg-stone-900/80 px-8 py-4 rounded-3xl border border-white/10 shadow-inner">
                {referralCode}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-2xl text-sm font-bold hover:bg-stone-50 transition-all active:scale-95 shadow-lg"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
                <Share2 className="w-5 h-5" />
                <span>Share Link</span>
              </button>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-white/5 w-full justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Poin Bonus</span>
                <span className="text-xs font-bold text-emerald-500">+5.000 PTS</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Limit Promo</span>
                <span className="text-xs font-bold text-amber-500">Unlimited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
