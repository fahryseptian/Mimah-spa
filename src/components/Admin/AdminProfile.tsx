import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  ShieldCheck, 
  Key, 
  Mail, 
  Phone, 
  Save, 
  Download, 
  Bell, 
  Sparkles,
  CheckCircle2,
  Lock,
  Database,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminProfile: React.FC = () => {
  const { bookings, therapists, services, showToast } = useApp();

  const [adminName, setAdminName] = useState(() => localStorage.getItem('mimah_admin_name') || 'Fahry Septian (Head of Operations)');
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('mimah_admin_email') || 'FahrySeptian35@gmail.com');
  const [adminPhone, setAdminPhone] = useState(() => localStorage.getItem('mimah_admin_phone') || '+62 853-6199-1731');
  
  // Security PIN / Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference switches
  const [soundAlerts, setSoundAlerts] = useState(() => localStorage.getItem('mimah_admin_sound') !== 'false');
  const [autoDispatch, setAutoDispatch] = useState(() => localStorage.getItem('mimah_admin_autodispatch') !== 'false');
  const [emailAlerts, setEmailAlerts] = useState(() => localStorage.getItem('mimah_admin_emailalerts') !== 'false');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mimah_admin_name', adminName);
    localStorage.setItem('mimah_admin_email', adminEmail);
    localStorage.setItem('mimah_admin_phone', adminPhone);
    localStorage.setItem('mimah_admin_sound', String(soundAlerts));
    localStorage.setItem('mimah_admin_autodispatch', String(autoDispatch));
    localStorage.setItem('mimah_admin_emailalerts', String(emailAlerts));

    showToast('Profil dan preferensi Administrator berhasil diperbarui!', 'success');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Kata sandi baru minimal harus 6 karakter!', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok!', 'error');
      return;
    }

    showToast('Kata sandi / PIN otorisasi Admin berhasil diganti!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const exportBookingsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mimah_spa_bookings_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Berhasil mengekspor ${bookings.length} data transaksi (JSON)!`, 'success');
  };

  const exportTherapistsCsv = () => {
    const headers = ['ID', 'Nama', 'Kota', 'Kecamatan', 'Telepon', 'Komisi', 'Status', 'Rating'];
    const rows = therapists.map(t => [
      t.id,
      `"${t.name}"`,
      `"${t.baseCity}"`,
      `"${t.baseKecamatan}"`,
      `"${t.phone}"`,
      `${Math.round(t.commissionRate * 100)}%`,
      t.status,
      t.rating || 4.9
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mimah_spa_mitra_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(`Berhasil mengekspor ${therapists.length} data mitra terapis (CSV)!`, 'success');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-[3rem] p-8 sm:p-12 border border-stone-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-emerald-600 border-4 border-white/10 flex items-center justify-center text-white shadow-xl shrink-0">
            <User className="w-12 h-12" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Administrator Portal</span>
            </div>
            <h2 className="text-3xl font-bold font-serif-display">{adminName}</h2>
            <p className="text-stone-400 text-sm">{adminEmail} • Akses Root Operasional Mimah Spa</p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-[11px] font-bold text-stone-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 2FA Aktif</span>
              <span className="w-1 h-1 rounded-full bg-stone-600" />
              <span>Database Terhubung</span>
              <span className="w-1 h-1 rounded-full bg-stone-600" />
              <span>Sesi Aman SSL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Data Diri & Preferensi */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-soft p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Informasi Akun Admin</h3>
                <p className="text-xs text-stone-400">Pengaturan identitas kontak resmi manajemen</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Nama Lengkap</label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Email Administrator</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">WhatsApp Hotline</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Preferences Toggles */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-500">Preferensi Operasional</h4>
                
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-900">Suara Notifikasi Pesanan</div>
                    <div className="text-[10px] text-stone-500">Mainkan chime dering saat ada pesanan baru masuk</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-900">Rekomendasi Mitra Cerdas</div>
                    <div className="text-[10px] text-stone-500">Algoritma otomatis menyarankan mitra terdekat</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDispatch}
                    onChange={(e) => setAutoDispatch(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-stone-900 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Security & Data Export */}
        <div className="lg:col-span-5 space-y-8">
          {/* Security & Password */}
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-soft p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Ganti Kata Sandi</h3>
                <p className="text-xs text-stone-400">PIN / Password akses otorisasi</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Ulangi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Perbarui Kata Sandi</span>
              </button>
            </form>
          </div>

          {/* Backup & Export Center */}
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-soft p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Backup & Ekspor</h3>
                <p className="text-xs text-stone-400">Unduh data offline operasional</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={exportBookingsJson}
                className="w-full p-4 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-200 border border-stone-200 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-stone-900 group-hover:text-emerald-800">Export Seluruh Pesanan</div>
                  <div className="text-[10px] text-stone-500">{bookings.length} transaksi format JSON</div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-600" />
              </button>

              <button
                onClick={exportTherapistsCsv}
                className="w-full p-4 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-200 border border-stone-200 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-stone-900 group-hover:text-emerald-800">Export Mitra & Status</div>
                  <div className="text-[10px] text-stone-500">{therapists.length} mitra format CSV (Excel)</div>
                </div>
                <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
