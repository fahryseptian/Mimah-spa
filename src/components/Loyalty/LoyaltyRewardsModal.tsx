import React from 'react';
import { X, Sparkles, Gift, Share2, Award, Zap, ChevronRight, Check, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const LoyaltyRewardsModal: React.FC = () => {
  const { isLoyaltyModalOpen, setIsLoyaltyModalOpen, userPoints, showToast } = useApp();

  if (!isLoyaltyModalOpen) return null;

  const tiers = [
    { name: 'Bronze', min: 0, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    { name: 'Silver', min: 25000, color: 'text-stone-500', bg: 'bg-stone-50', border: 'border-stone-200' },
    { name: 'Gold', min: 100000, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { name: 'Diamond', min: 500000, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  ];

  const waysToEarn = [
    { title: 'Selesaikan Layanan', points: '1.000', desc: 'Dapatkan poin untuk setiap sesi terapi yang selesai.', icon: <Award className="w-5 h-5" /> },
    { title: 'Referral Teman', points: '5.000', desc: 'Dapatkan poin saat teman memesan layanan pertama.', icon: <Share2 className="w-5 h-5" /> },
    { title: 'Review & Rating', points: '500', desc: 'Berikan ulasan jujurmu setelah sesi berakhir.', icon: <Gift className="w-5 h-5" /> },
    { title: 'Bonus Weekend', points: '2x', desc: 'Poin ganda untuk pemesanan di hari Sabtu & Minggu.', icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#FAFAFA] rounded-[2.5rem] max-w-xl w-full max-h-[90vh] overflow-hidden shadow-premium border border-white flex flex-col"
      >
        
        {/* Header */}
        <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm border border-amber-100">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-serif-display leading-tight">Mimah Rewards</h2>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-0.5">Exclusive Loyalty Program</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLoyaltyModalOpen(false)}
            className="p-3 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-2xl transition-all border border-stone-100 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
          
          {/* Points Card */}
          <div className="relative group overflow-hidden rounded-[2rem] bg-stone-900 p-8 text-white shadow-premium">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 group-hover:opacity-30 transition-opacity" />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Personal Membership</span>
                  <div className="w-8 h-5 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black font-serif-display tracking-tight leading-none">{userPoints.toLocaleString()}</span>
                  <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Points</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-stone-400 uppercase tracking-widest">Progress Ke Silver Tier</span>
                  <span className="text-amber-400">20%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '20%' }}
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400" 
                  />
                </div>
                <p className="text-[10px] text-stone-500 font-bold italic">Selesaikan 2 sesi lagi untuk naik level!</p>
              </div>
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-200/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-900">Program Referral Teman Medan</h4>
              </div>
              <span className="text-[10px] font-black bg-amber-400 text-stone-900 px-2.5 py-0.5 rounded-full uppercase">+2.500 PTS</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Bagikan kode unik Anda kepada teman atau kerabat di Medan. Dapatkan <strong>2.500 Poin</strong> saat teman Anda melakukan pemesanan pertama!
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-white border border-amber-200 rounded-xl font-mono text-sm font-black text-amber-900 tracking-wider">
                MIMAH-MEDAN-88
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('MIMAH-MEDAN-88');
                  showToast('Kode Referral MIMAH-MEDAN-88 berhasil disalin ke clipboard!', 'success');
                }}
                className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md shadow-stone-900/10"
              >
                Salin Kode
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Kumpulkan Poin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {waysToEarn.map((way, i) => (
                <div key={i} className="group p-5 rounded-3xl bg-white border border-stone-100 hover:border-emerald-200 transition-all duration-300 shadow-soft hover:shadow-premium">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 text-emerald-600 flex items-center justify-center border border-stone-100 group-hover:bg-emerald-50 transition-colors">
                      {way.icon}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black tracking-widest">
                      +{way.points}
                    </div>
                  </div>
                  <h4 className="font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">{way.title}</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed mt-1 font-medium">{way.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Membership Levels */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Membership Level</h3>
            <div className="bg-white rounded-[2rem] border border-stone-100 divide-y divide-stone-50 overflow-hidden shadow-soft">
              {tiers.map((tier, i) => (
                <div key={i} className={`flex items-center justify-between p-6 group transition-all cursor-default ${userPoints >= tier.min ? 'bg-emerald-50/20' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${tier.bg} flex items-center justify-center border ${tier.border} shadow-sm transition-transform group-hover:scale-110`}>
                      <Star className={`w-6 h-6 ${tier.color}`} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${tier.color}`}>{tier.name} Status</h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Min. {tier.min.toLocaleString()} PTS</p>
                    </div>
                  </div>
                  {userPoints >= tier.min ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-stone-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-8 border-t border-stone-100 bg-white">
          <button 
            onClick={() => setIsLoyaltyModalOpen(false)}
            className="w-full py-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-3xl text-sm font-bold shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Kumpulkan Mimah Points</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
