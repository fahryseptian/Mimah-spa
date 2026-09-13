import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Clock, 
  Phone, 
  MessageCircle, 
  DollarSign, 
  Award, 
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Target,
  Percent
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { GlobalSettings as GlobalSettingsType } from '../../types';

export const GlobalSettings: React.FC = () => {
  const { globalSettings, updateGlobalSettings } = useApp();
  const [localSettings, setLocalSettings] = useState<GlobalSettingsType>(globalSettings);

  const handleSave = () => {
    updateGlobalSettings(localSettings);
  };

  const handleChange = (field: keyof GlobalSettingsType, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-stone-900 font-serif-display">Pengaturan Global Sistem</h3>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Konfigurasi Operasional & Kebijakan Platform</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Perubahan</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact & Emergency */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-stone-900 font-serif-display">Kontak & Darurat</h4>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                Nomor WhatsApp Admin (CS)
                <HelpCircle className="w-3 h-3 text-stone-300" />
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                <input 
                  type="text" 
                  value={localSettings.adminWhatsapp}
                  onChange={(e) => handleChange('adminWhatsapp', e.target.value)}
                  placeholder="628123456789"
                  className="w-full pl-12 pr-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                Nomor Darurat SOS Terapis
                <ShieldAlert className="w-3 h-3 text-rose-300" />
              </label>
              <div className="relative">
                <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                <input 
                  type="text" 
                  value={localSettings.sosEmergencyPhone}
                  onChange={(e) => handleChange('sosEmergencyPhone', e.target.value)}
                  placeholder="628123456789"
                  className="w-full pl-12 pr-6 py-4 bg-rose-50/30 border border-rose-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Config */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-stone-900 font-serif-display">Waktu & Komisi</h4>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Buka Layanan (Start)</label>
              <input 
                type="time" 
                value={localSettings.operatingHoursStart}
                onChange={(e) => handleChange('operatingHoursStart', e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Tutup Layanan (End)</label>
              <input 
                type="time" 
                value={localSettings.operatingHoursEnd}
                onChange={(e) => handleChange('operatingHoursEnd', e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Komisi Standar Mitra (%)</label>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="number" 
                step="0.01"
                min="0"
                max="1"
                value={localSettings.defaultCommissionRate}
                onChange={(e) => handleChange('defaultCommissionRate', parseFloat(e.target.value))}
                className="w-full pl-12 pr-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-stone-400 uppercase">Input dlm Desimal (0.75 = 75%)</div>
            </div>
          </div>
        </div>

        {/* Loyalty Program */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-stone-900 font-serif-display">Program Loyalitas & Hadiah (Mimah Points)</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Poin Per Ulasan</label>
              <input 
                type="number" 
                value={localSettings.loyaltyPointsPerReview}
                onChange={(e) => handleChange('loyaltyPointsPerReview', parseInt(e.target.value))}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Bonus Referral</label>
              <input 
                type="number" 
                value={localSettings.referralRewardPoints}
                onChange={(e) => handleChange('referralRewardPoints', parseInt(e.target.value))}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Min. Penukaran</label>
              <input 
                type="number" 
                value={localSettings.minPointsToRedeem}
                onChange={(e) => handleChange('minPointsToRedeem', parseInt(e.target.value))}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Kurs (1 Poin = RpX)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input 
                  type="number" 
                  value={localSettings.pointsToRupiahRate}
                  onChange={(e) => handleChange('pointsToRupiahRate', parseInt(e.target.value))}
                  className="w-full pl-12 pr-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-1" />
        <div className="space-y-1">
          <h5 className="text-sm font-bold text-amber-900">Perhatian: Perubahan Sistem Bersifat Langsung</h5>
          <p className="text-xs text-amber-700 leading-relaxed">Pastikan Anda telah memeriksa kembali nomor WhatsApp dan jam operasional sebelum menyimpan. Perubahan akan segera berdampak pada seluruh pengguna aplikasi.</p>
        </div>
      </div>
    </div>
  );
};
