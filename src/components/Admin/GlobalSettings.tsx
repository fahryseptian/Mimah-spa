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
  Building2,
  Mail,
  MapPin,
  CreditCard,
  QrCode,
  Compass,
  Moon,
  ShieldCheck,
  RefreshCw,
  Percent,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { GlobalSettings as GlobalSettingsType } from '../../types';

export const GlobalSettings: React.FC = () => {
  const { globalSettings, updateGlobalSettings, showToast } = useApp();
  const [localSettings, setLocalSettings] = useState<GlobalSettingsType>(globalSettings);
  const [activeTab, setActiveTab] = useState<'all' | 'identity' | 'contact' | 'operating' | 'payment' | 'policy' | 'loyalty'>('all');

  const handleSave = () => {
    updateGlobalSettings(localSettings);
    showToast('Seluruh Konfigurasi Sistem Berhasil Diperbarui!', 'success');
  };

  const handleChange = (field: keyof GlobalSettingsType, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Save Action */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pusat Kontrol Config Platform</span>
            </div>
            <h3 className="text-2xl font-bold text-stone-900 font-serif-display">Pengaturan Global Sistem</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Kelola kebijakan operasional, rekening pembayaran, komisi mitra, integrasi WhatsApp, dan program loyalitas Mimah Spa.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Perubahan</span>
          </motion.button>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-stone-100">
          {[
            { id: 'all', label: 'Semua Pengaturan' },
            { id: 'identity', label: 'Identitas & Usaha' },
            { id: 'contact', label: 'Kontak & SOS Darurat' },
            { id: 'operating', label: 'Waktu & Geofencing' },
            { id: 'payment', label: 'Rekening Bank & QRIS' },
            { id: 'policy', label: 'Komisi & Refund' },
            { id: 'loyalty', label: 'Poin & Referral' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Identitas Usaha & Alamat Pusat */}
        {(activeTab === 'all' || activeTab === 'identity') && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-2xl">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">Identitas Usaha & Alamat Pusat</h4>
                <p className="text-xs text-stone-500">Informasi resmi entitas bisnis yang tampil di invoice & aplikasi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Nama Usaha / Brand</label>
                <input 
                  type="text" 
                  value={localSettings.companyName || ''}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Mimah Spa Medan"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Tagline / Slogan Layanan</label>
                <input 
                  type="text" 
                  value={localSettings.companyTagline || ''}
                  onChange={(e) => handleChange('companyTagline', e.target.value)}
                  placeholder="Home Care & Wellness Specialist"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Alamat Kantor Pusat Medan</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input 
                    type="text" 
                    value={localSettings.companyAddress || ''}
                    onChange={(e) => handleChange('companyAddress', e.target.value)}
                    placeholder="Jl. Gajah Mada No. 45, Medan Petisah, Kota Medan"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Email Layanan Pelanggan</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input 
                    type="email" 
                    value={localSettings.supportEmail || ''}
                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                    placeholder="support@mimahspa.id"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Kontak & Jalur Darurat */}
        {(activeTab === 'all' || activeTab === 'contact') && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">Kontak WhatsApp & Sinyal SOS</h4>
                <p className="text-xs text-stone-500">Nomor gateway CS resmi & pemicu kedaruratan terapis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1 flex items-center gap-1.5">
                  <span>Nomor WhatsApp Admin CS Utama</span>
                  <HelpCircle className="w-3.5 h-3.5 text-stone-300" />
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
                  <input 
                    type="text" 
                    value={localSettings.adminWhatsapp}
                    onChange={(e) => handleChange('adminWhatsapp', e.target.value)}
                    placeholder="6285361991731"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-400 ml-1">Gunakan format internasional tanpa tanda + (contoh: 6285361991731)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-700 ml-1 flex items-center gap-1.5">
                  <span>Nomor Hotline Darurat SOS Terapis</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-3.5 top-3.5 w-4 h-4 text-rose-600" />
                  <input 
                    type="text" 
                    value={localSettings.sosEmergencyPhone}
                    onChange={(e) => handleChange('sosEmergencyPhone', e.target.value)}
                    placeholder="628123456789"
                    className="w-full pl-10 pr-4 py-3 bg-rose-50/40 border border-rose-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-rose-500 ml-1">Nomor ini menerima notifikasi darurat langsung dari tombol SOS aplikasi mitra terapis.</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Waktu Operasional & Geofencing Transport */}
        {(activeTab === 'all' || activeTab === 'operating') && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">Jam Operasional & Geofencing</h4>
                <p className="text-xs text-stone-500">Batasan waktu booking, jangkauan wilayah, dan surcharge malam</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 ml-1">Jam Buka Layanan</label>
                  <input 
                    type="time" 
                    value={localSettings.operatingHoursStart}
                    onChange={(e) => handleChange('operatingHoursStart', e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 ml-1">Jam Tutup Layanan</label>
                  <input 
                    type="time" 
                    value={localSettings.operatingHoursEnd}
                    onChange={(e) => handleChange('operatingHoursEnd', e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 ml-1">Radius Max Layanan (KM)</label>
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input 
                      type="number" 
                      value={localSettings.maxServiceRadiusKm || 25}
                      onChange={(e) => handleChange('maxServiceRadiusKm', parseFloat(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 ml-1">Surcharge Malam (Rp)</label>
                  <div className="relative">
                    <Moon className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input 
                      type="number" 
                      value={localSettings.nightSurchargeAmount || 25000}
                      onChange={(e) => handleChange('nightSurchargeAmount', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Rekening Bank & QRIS Resmi */}
        {(activeTab === 'all' || activeTab === 'payment') && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">Rekening Bank & Merchant QRIS</h4>
                <p className="text-xs text-stone-500">Tujuan transfer resmi pembayaran booking pelanggan</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Nama Bank Perusahaan</label>
                <input 
                  type="text" 
                  value={localSettings.bankName || ''}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  placeholder="Bank BCA (Bank Central Asia)"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 ml-1">Nomor Rekening Bank</label>
                  <input 
                    type="text" 
                    value={localSettings.bankAccountNumber || ''}
                    onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                    placeholder="8271092812"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 ml-1">Nama Pemilik Rekening</label>
                  <input 
                    type="text" 
                    value={localSettings.bankAccountName || ''}
                    onChange={(e) => handleChange('bankAccountName', e.target.value)}
                    placeholder="PT MIMAH SPA MEDAN"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Nama Merchant Static QRIS</label>
                <div className="relative">
                  <QrCode className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input 
                    type="text" 
                    value={localSettings.qrisMerchantName || ''}
                    onChange={(e) => handleChange('qrisMerchantName', e.target.value)}
                    placeholder="MIMAH SPA MEDAN OFFICIAL"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Komisi Mitra & Kebijakan Pembatalan */}
        {(activeTab === 'all' || activeTab === 'policy') && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">Komisi Mitra & Kebijakan Refund</h4>
                <p className="text-xs text-stone-500">Skema bagi hasil mitra & aturan pembatalan pesanan</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Bagi Hasil Mitra Terapis (Skema Komisi)</label>
                <div className="relative">
                  <Percent className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="1"
                    value={localSettings.defaultCommissionRate}
                    onChange={(e) => handleChange('defaultCommissionRate', parseFloat(e.target.value))}
                    className="w-full pl-10 pr-28 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                    {Math.round(localSettings.defaultCommissionRate * 100)}% Mitra
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 ml-1">Batas Gratis Batal (Menit)</label>
                  <input 
                    type="number" 
                    value={localSettings.freeCancellationWindowMinutes || 60}
                    onChange={(e) => handleChange('freeCancellationWindowMinutes', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 ml-1">Potongan Pembatalan (%)</label>
                  <input 
                    type="number" 
                    value={localSettings.cancellationFeePercentage || 20}
                    onChange={(e) => handleChange('cancellationFeePercentage', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. Program Loyalitas & Hadiah */}
        {(activeTab === 'all' || activeTab === 'loyalty') && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">Program Loyalitas & Rewards</h4>
                <p className="text-xs text-stone-500">Nilai tukar poin ulasan, referral reward, & batas redeem</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Poin Per Ulasan Bintang 5</label>
                <input 
                  type="number" 
                  value={localSettings.loyaltyPointsPerReview}
                  onChange={(e) => handleChange('loyaltyPointsPerReview', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Bonus Referral Pelanggan</label>
                <input 
                  type="number" 
                  value={localSettings.referralRewardPoints}
                  onChange={(e) => handleChange('referralRewardPoints', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Minimum Poin Penukaran</label>
                <input 
                  type="number" 
                  value={localSettings.minPointsToRedeem}
                  onChange={(e) => handleChange('minPointsToRedeem', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 ml-1">Nilai Poin (1 Poin = RpX)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
                  <input 
                    type="number" 
                    value={localSettings.pointsToRupiahRate}
                    onChange={(e) => handleChange('pointsToRupiahRate', parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Warning Footer Notice */}
      <div className="p-5 bg-amber-50 rounded-3xl border border-amber-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">Perhatian: Sinkronisasi Real-Time</h5>
          <p className="text-xs text-amber-800 leading-relaxed">
            Perubahan konfigurasi global di atas akan langsung tersimpan di sistem dan berdampak secara otomatis pada kalkulasi harga, potongan komisi terapis, serta gateway WhatsApp operasional Mimah Spa.
          </p>
        </div>
      </div>
    </div>
  );
};
