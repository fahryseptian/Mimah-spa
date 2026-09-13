import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Settings, 
  Briefcase,
  Navigation,
  Send,
  TrendingUp, 
  Coins, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Check, 
  X, 
  Save, 
  Tag, 
  Sliders, 
  Clock, 
  FileText,
  Download,
  Building2,
  CloudRain,
  Package,
  ChevronRight,
  Info,
  AlertCircle,
  ArrowUpRight,
  Percent,
  LogOut,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Therapist, TransportTariffConfig, Voucher } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { FinanceDashboard } from './FinanceDashboard';
import { CustomerCRM } from './CustomerCRM';
import { GlobalSettings } from './GlobalSettings';
import { DisputeCenter } from './DisputeCenter';
import { MonitoringMap } from './MonitoringMap';
import { BroadcastCenter } from './BroadcastCenter';
import { VoucherManagement } from './VoucherManagement';
import { ServiceManagement } from './ServiceManagement';
import { InventoryManagement } from './InventoryManagement';

export const AdminManagement: React.FC = () => {
  const { 
    therapists, 
    addTherapist, 
    updateTherapist, 
    deleteTherapist, 
    bookings, 
    services,
    tariffConfig, 
    updateTariffConfig, 
    vouchers,
    cities,
    inventory,
    updateTherapistInventory,
    addService,
    updateService,
    deleteService,
    updateBookingStatus,
    whatsappNumber,
    updateWhatsappNumber,
    showToast,
    activeAdminTab,
    setActiveAdminTab,
    stockRequests,
    approveStockRequest,
    rejectStockRequest,
    whatsappLogs,
    clearWhatsappLogs,
    refundDisputes,
    logout
  } = useApp();

  // Inventory Management State
  const [selectedTherapistForInv, setSelectedTherapistForInv] = useState<string | null>(null);
  const [invItemId, setInvItemId] = useState('');
  const [invQty, setInvQty] = useState(1);
  const [invCondition, setInvCondition] = useState<'good' | 'worn' | 'broken'>('good');
  const [therapistSearch, setTherapistSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // Modal Add/Edit Therapist State
  const [isTherapistModalOpen, setIsTherapistModalOpen] = useState(false);
  const [editingTherapistId, setEditingTherapistId] = useState<string | null>(null);

  // Form fields for Therapist
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'female' | 'male'>('female');
  const [formAge, setFormAge] = useState(30);
  const [formPhone, setFormPhone] = useState('0812-');
  const [formPhoto, setFormPhoto] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80');
  const [formCity, setFormCity] = useState(cities[0].city);
  const [formKecamatan, setFormKecamatan] = useState('Medan Baru');
  const [formSpecialties, setFormSpecialties] = useState('Pijat Tradisional Kebugaran, Refleksi Kaki');
  const [formCertName, setFormCertName] = useState('Sertifikasi BNSP Terapis Madya');
  const [formCertIssuer, setFormCertIssuer] = useState('LSP Cohespa Indonesia');
  const [formCertYear, setFormCertYear] = useState(2022);
  const [formBio, setFormBio] = useState('');
  const [formCommission, setFormCommission] = useState(75);

  // Tariff & WhatsApp config local form
  const [tempTariff, setTempTariff] = useState<TransportTariffConfig>(tariffConfig);
  const [tempWhatsapp, setTempWhatsapp] = useState<string>(whatsappNumber);

  // Calculation metrics
  const totalOmzet = bookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.totalAmount : 0), 0) || 24500000;
  
  // Calculate platform fee more accurately based on therapist commission rates
  const platformFee = bookings.reduce((sum, b) => {
    if (b.status !== 'completed') return sum;
    const therapist = therapists.find(t => t.id === b.therapistId);
    const rate = therapist ? therapist.commissionRate : 0.75;
    return sum + Math.round(b.totalAmount * (1 - rate));
  }, 0) || Math.round(totalOmzet * 0.35); // Default to ~35% if no bookings yet for demo
  
  const therapistPayouts = totalOmzet - platformFee;
  const activeTherapistsCount = therapists.filter(t => t.status === 'online').length;
  const avgRating = (therapists.reduce((sum, t) => sum + t.rating, 0) / (therapists.length || 1)).toFixed(2);

  const exportTransactionsToCSV = () => {
    if (bookings.length === 0) {
      showToast('Tidak ada data transaksi untuk diekspor!', 'warning');
      return;
    }
    
    // Header Row
    const headers = ['Booking Code', 'Customer Name', 'Customer Phone', 'Service Title', 'Booking Date', 'Booking Time Slot', 'Payment Method', 'Gross Amount', 'Status'];
    
    // Data Rows
    const rows = bookings.map(b => [
      `"${b.bookingCode}"`,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.serviceTitle}"`,
      `"${b.bookingDate}"`,
      `"${b.bookingTimeSlot}"`,
      `"${b.paymentMethod}"`,
      b.totalAmount,
      `"${b.status}"`
    ]);
    
    // Join with newlines
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Blob & Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_transaksi_mimah_spa_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Laporan transaksi berhasil diunduh sebagai file CSV!', 'success');
  };

  const handleOpenAdd = () => {
    setEditingTherapistId(null);
    setFormEmail('');
    setFormPassword('');
    setFormName('');
    setFormGender('female');
    setFormAge(30);
    setFormPhone('0812-');
    setFormPhoto('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80');
    setFormCity(cities[0].city);
    setFormKecamatan('Medan Baru');
    setFormSpecialties('Pijat Tradisional Kebugaran, Refleksi Kaki');
    setFormBio('Terapis ramah, teliti dan profesional berpengalaman di area Medan.');
    setFormCommission(75);
    setFormCertName('Sertifikasi BNSP Terapis Madya');
    setFormCertIssuer('LSP Cohespa Indonesia');
    setFormCertYear(2022);
    setIsTherapistModalOpen(true);
  };

  const handleOpenEdit = (t: Therapist) => {
    setEditingTherapistId(t.id);
    setFormEmail(t.email || ''); // Assuming email is in therapist type
    setFormName(t.name);
    setFormGender(t.gender);
    setFormAge(t.age);
    setFormPhone(t.phone);
    setFormPhoto(t.photoUrl);
    setFormCity(t.baseCity);
    setFormKecamatan(t.baseKecamatan);
    setFormSpecialties((t.specialties || []).join(', '));
    setFormBio(t.bio);
    setFormCommission(Math.round(t.commissionRate * 100));
    if (t.certifications && t.certifications[0]) {
      setFormCertName(t.certifications[0].name);
      setFormCertIssuer(t.certifications[0].issuer);
      setFormCertYear(t.certifications[0].year);
    } else {
      setFormCertName('');
      setFormCertIssuer('');
      setFormCertYear(2022);
    }
    setIsTherapistModalOpen(true);
  };

  const handleSaveTherapist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formName.trim()) { alert('Nama lengkap wajib diisi'); return; }
    if (!formEmail.trim() && !editingTherapistId) { alert('Email wajib diisi'); return; }
    if (!formPhone.trim()) { alert('Nomor WhatsApp wajib diisi'); return; }
    if (formCommission < 10 || formCommission > 95) { alert('Bagi hasil mitra harus antara 10% dan 95%'); return; }
    
    const specsArray = formSpecialties.split(',').map(s => s.trim()).filter(Boolean);

    const therapistPayload = {
      name: formName,
      email: formEmail,
      gender: formGender,
      age: Number(formAge),
      phone: formPhone,
      photoUrl: formPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      baseCity: formCity,
      baseKecamatan: formKecamatan,
      operationalCities: [formCity],
      status: 'online' as const,
      commissionRate: Number(formCommission) / 100,
      bio: formBio,
      vaccinated: true,
      equipmentProvided: ['Matras Lipat Busa', 'Sprei Sekali Pakai', 'Minyak Alami Aromaterapi', 'Handuk Bersih'],
      specialties: specsArray,
      certifications: [
        {
          name: formCertName || 'Sertifikasi BNSP Terapis',
          issuer: formCertIssuer || 'Badan Nasional Sertifikasi Profesi',
          year: Number(formCertYear),
          verified: true,
        }
      ],
      experienceYears: 5,
    };

    if (editingTherapistId) {
      updateTherapist(editingTherapistId, therapistPayload);
      showToast('Data akun & profil terapis berhasil diperbarui!', 'success');
    } else {
      // Call API to create auth user
      try {
        const response = await fetch('/api/create-therapist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formEmail, password: formPassword, profileData: therapistPayload }),
        });
        const result = await response.json();
        if (result.success) {
          addTherapist({ id: result.user.id, ...therapistPayload });
        } else {
          throw new Error(result.error);
        }
      } catch (error: any) {
        alert('Gagal membuat akun terapis: ' + error.message);
        return;
      }
    }

    setIsTherapistModalOpen(false);
  };

  const handleSaveTariff = (e: React.FormEvent) => {
    e.preventDefault();
    updateTariffConfig(tempTariff);
    updateWhatsappNumber(tempWhatsapp);
    showToast('Konfigurasi tarif dan WhatsApp berhasil disimpan!', 'success');
  };

  return (
    <div className="h-full flex flex-col w-full max-w-full overflow-x-hidden pb-12 px-1 sm:px-0">
      
      {/* Top Header - Command Center Style */}
      <div className="shrink-0 bg-stone-900 text-white rounded-[1.75rem] md:rounded-[2.5rem] p-5 sm:p-8 border border-stone-800 shadow-2xl relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>Operational Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif-display tracking-tight">
              Manajemen Sistem Mimah Spa
            </h1>
            <p className="text-sm text-stone-400 font-medium max-w-2xl">
              Otoritas penuh manajemen mitra terapis, kendali tarif transportasi nasional, dan monitoring logistik operasional secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-800/50 p-1.5 rounded-2xl border border-stone-700/50 mr-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveAdminTab('profile')}
                className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${
                  activeAdminTab === 'profile' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                    : 'text-stone-400 hover:text-white hover:bg-stone-700'
                }`}
                title="Profil Admin"
              >
                <User className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Admin</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => logout()}
                className="p-2.5 text-stone-400 hover:text-rose-400 hover:bg-rose-900/20 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Mitra Baru</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Ticker & Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Ticker */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-100 shadow-sm p-5 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-4 border-r border-stone-100 pr-6 shrink-0 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-emerald-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest">Live Activity</h3>
              <p className="text-[10px] text-stone-400 font-medium">Status operasional hari ini</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-between w-full overflow-x-auto no-scrollbar gap-8 pb-1 sm:pb-0">
            {[
              { label: 'Total Order', val: bookings.length || 0, color: 'text-stone-900', icon: FileText },
              { label: 'Aktif Sesi', val: bookings.filter(b => b.status === 'in_session').length || 0, color: 'text-blue-600', icon: Clock },
              { label: 'Mitra Online', val: activeTherapistsCount, color: 'text-emerald-600', icon: Users },
              { label: 'Rating Rata2', val: avgRating, color: 'text-amber-500', icon: Star },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 min-w-fit">
                <div className={`w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4 opacity-70" />
                </div>
                <div>
                  <div className={`text-sm font-black ${stat.color}`}>{stat.val}</div>
                  <div className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter whitespace-nowrap">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Shortcut Card */}
        <div className="lg:col-span-4 bg-emerald-600 text-white rounded-3xl p-5 shadow-xl shadow-emerald-900/10 relative overflow-hidden group">
          <div className="absolute top-2 right-2 opacity-10 group-hover:scale-110 transition-transform select-none pointer-events-none">
            <span className="text-7xl font-extrabold font-serif-display">Rp</span>
          </div>
          <div className="relative z-10 space-y-1">
            <div className="text-[9px] font-black text-emerald-200 uppercase tracking-widest">Total Gross Omzet</div>
            <div className="text-2xl font-black tracking-tighter">{formatRupiah(totalOmzet)}</div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-emerald-100/70 italic">*Estimasi berjalan</span>
              <button onClick={() => setActiveAdminTab('finance')} className="text-[10px] font-black uppercase underline decoration-2 underline-offset-4 hover:text-emerald-100 transition-colors">Detail Keuangan</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-y border-stone-200/50 py-3 -mx-5 px-5">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2">
          {[
            { id: 'analytics', label: 'Dashboard Utama', icon: TrendingUp },
            { id: 'crm', label: 'Data Pelanggan', icon: Users },
            { id: 'broadcast', label: 'Broadcast', icon: Send },
            { id: 'monitoring', label: 'Monitoring', icon: Navigation },
            { id: 'disputes', label: 'Pengaduan', icon: AlertCircle, badge: refundDisputes.filter(d => d.status === 'pending').length },
            { id: 'therapists', label: 'Mitra Terapis', icon: Briefcase },
            { id: 'transactions', label: 'Log Transaksi', icon: FileText, badge: bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length },
            { id: 'inventory', label: 'Manajemen Stok', icon: Package },
            { id: 'services', label: 'Layanan', icon: Sliders },
            { id: 'vouchers', label: 'Voucher', icon: Tag },
            { id: 'finance', label: 'Keuangan', icon: Coins },
            { id: 'settings', label: 'Pengaturan', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 relative ${
                activeAdminTab === tab.id
                  ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/20'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeAdminTab === tab.id ? 'text-emerald-400' : 'opacity-50'}`} />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 text-[9px] font-black shadow-sm">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-1">
        {activeAdminTab === 'analytics' && (
          <AnalyticsDashboard 
            bookings={bookings} 
            therapists={therapists} 
            services={services} 
          />
        )}

        {activeAdminTab === 'finance' && (
          <FinanceDashboard />
        )}

        {activeAdminTab === 'crm' && (
          <CustomerCRM />
        )}

        {activeAdminTab === 'settings' && (
          <GlobalSettings />
        )}
        
        {activeAdminTab === 'profile' && (
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-stone-900 font-serif-display">Profil Admin</h3>
            <p className="text-stone-600">Fitur pengelolaan profil admin akan segera hadir.</p>
          </div>
        )}

        {activeAdminTab === 'disputes' && (
          <DisputeCenter />
        )}

        {activeAdminTab === 'monitoring' && (
          <MonitoringMap />
        )}

        {activeAdminTab === 'broadcast' && (
          <BroadcastCenter />
        )}

        {activeAdminTab === 'therapists' && (
          <div className="space-y-6">
            {/* Optimized Quick Statistics Widget */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm space-y-2">
                <div className="text-[9px] font-black uppercase tracking-wider text-stone-400">Total Mitra Terdaftar</div>
                <div className="text-2xl font-black text-stone-900">{therapists.length} Mitra</div>
                <div className="text-[10px] text-stone-500 font-medium">Bermutu & Tersertifikasi</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm space-y-2">
                <div className="text-[9px] font-black uppercase tracking-wider text-stone-400">Mitra Aktif (Online)</div>
                <div className="text-2xl font-black text-emerald-600">
                  {therapists.filter(t => t.status === 'online').length} Mitra
                </div>
                <div className="text-[10px] text-emerald-600/80 font-bold">Siap Menerima Sesi</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm space-y-2">
                <div className="text-[9px] font-black uppercase tracking-wider text-stone-400">Terapis Wanita</div>
                <div className="text-2xl font-black text-pink-600">
                  {therapists.filter(t => t.gender === 'female').length} Terapis
                </div>
                <div className="text-[10px] text-stone-500 font-medium">Spesialisasi Ibu & Anak</div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm space-y-2">
                <div className="text-[9px] font-black uppercase tracking-wider text-stone-400">Terapis Pria</div>
                <div className="text-2xl font-black text-blue-600">
                  {therapists.filter(t => t.gender === 'male').length} Terapis
                </div>
                <div className="text-[10px] text-stone-500 font-medium">Spesialisasi Cedera & Refleksi</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
              <div className="relative flex-1 max-w-lg">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input 
                  type="text"
                  placeholder="Cari nama mitra atau domisili kecamatan..."
                  value={therapistSearch}
                  onChange={(e) => setTherapistSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                />
              </div>
              <button
                onClick={handleOpenAdd}
                className="px-5 py-3 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-800 transition-all shadow-md shadow-stone-900/10"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Mitra Baru
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50 border-b border-stone-100">
                      <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Data Dasar Mitra</th>
                      <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Domisili Tugas</th>
                      <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-center">Performa</th>
                      <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-center">Bagi Hasil Mitra (Komisi)</th>
                      <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-center">Status Keaktifan</th>
                      <th className="p-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-right">Manajemen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {therapists
                      .filter(t => t.name.toLowerCase().includes(therapistSearch.toLowerCase()) || t.baseKecamatan.toLowerCase().includes(therapistSearch.toLowerCase()))
                      .map((t) => (
                        <tr key={t.id} className="hover:bg-stone-50/50 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img src={t.photoUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border border-stone-200" />
                                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${t.status === 'online' ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-stone-900 tracking-tight">{t.name}</div>
                                <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider text-pink-600">
                                  {t.gender === 'female' ? 'Wanita' : 'Pria'} • {t.age} th
                                </div>
                                <div className="text-[10px] text-stone-400 font-medium">WA: {t.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-0.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              {t.baseKecamatan}
                            </div>
                            <div className="text-[10px] text-stone-400 font-medium">{t.baseCity}</div>
                          </td>
                          <td className="p-6 text-center">
                            <div className="inline-flex flex-col items-center">
                              <div className="font-black text-sm text-amber-500 flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                {t.rating}
                              </div>
                              <div className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">{t.completedOrders} Order</div>
                            </div>
                          </td>
                          <td className="p-6 text-center">
                            {/* Inline commission modification toggle for supreme control speed */}
                            <select
                              value={t.commissionRate}
                              onChange={(e) => {
                                updateTherapist(t.id, { commissionRate: parseFloat(e.target.value) });
                                showToast(`Komisi ${t.name} disesuaikan ke ${parseFloat(e.target.value) * 100}%!`, 'success');
                              }}
                              className="bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-black text-stone-900 py-1.5 px-3 outline-none cursor-pointer hover:bg-stone-100 transition-colors"
                            >
                              <option value="0.6">60% Mitra</option>
                              <option value="0.7">70% Mitra</option>
                              <option value="0.75">75% Mitra</option>
                              <option value="0.8">80% Mitra</option>
                              <option value="0.85">85% Mitra</option>
                              <option value="0.9">90% Mitra</option>
                            </select>
                          </td>
                          <td className="p-6 text-center">
                            {/* Inline status toggle */}
                            <select
                              value={t.status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as any;
                                updateTherapist(t.id, { status: nextStatus });
                                showToast(`Status ${t.name} diubah ke ${nextStatus.toUpperCase()}!`, 'info');
                              }}
                              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border cursor-pointer outline-none transition-all ${
                                t.status === 'online' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                  : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                              }`}
                            >
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                            </select>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleOpenEdit(t)}
                                className="p-2.5 bg-stone-50 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all hover:scale-105 border border-stone-100"
                                title="Edit data mitra"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm(`Hapus akun mitra ${t.name} dari sistem Mimah Spa?`)) {
                                    deleteTherapist(t.id);
                                  }
                                }}
                                className="p-2.5 bg-stone-50 hover:bg-rose-50 text-rose-600 rounded-xl transition-all hover:scale-105 border border-stone-100"
                                title="Hapus mitra"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeAdminTab === 'transactions' && (
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-stone-100 bg-stone-50/30 flex items-center justify-between gap-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Log Transaksi Real-time</h3>
              <button 
                onClick={exportTransactionsToCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-900/10"
              >
                <Download className="w-3 h-3" />
                Ekspor CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 font-black text-[9px] uppercase tracking-widest">
                    <th className="py-4 px-6">ID Booking</th>
                    <th className="py-4 px-4">Klien</th>
                    <th className="py-4 px-4">Layanan</th>
                    <th className="py-4 px-4">Mitra</th>
                    <th className="py-4 px-4">Metode Bayar</th>
                    <th className="py-4 px-4">Gross Revenue</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="py-4 px-6 font-black text-stone-900 tracking-tighter">#{b.bookingCode}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-stone-900">{b.customerName}</div>
                          <div className="text-[9px] text-stone-400">{b.customerPhone}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-stone-700">{b.serviceTitle}</div>
                          <div className="text-[9px] text-stone-400">{b.bookingDate} • {b.bookingTimeSlot}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {b.therapistPhoto && <img src={b.therapistPhoto} className="w-6 h-6 rounded-lg object-cover" alt="" />}
                            <span className="font-bold text-stone-800">{b.therapistName || 'Pending'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 uppercase font-black text-[9px] text-stone-500">{b.paymentMethod}</td>
                        <td className="py-4 px-4 font-black text-emerald-700">{formatRupiah(b.totalAmount)}</td>
                        <td className="py-4 px-4">
                          <select 
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as any, 'Status diperbarui secara manual oleh Administrator.')}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all ${
                              b.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              b.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                              'bg-stone-50 text-stone-600 border-stone-100'
                            }`}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="therapist_on_the_way">On The Way</option>
                            <option value="therapist_arrived">Arrived</option>
                            <option value="in_session">In Session</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                           <button 
                            onClick={() => { if(window.confirm('Batalkan pesanan ini?')) updateBookingStatus(b.id, 'cancelled', 'Dibatalkan oleh Admin.'); }}
                            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                           >
                            <Trash2 className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeAdminTab === 'vouchers' && <VoucherManagement />}
        
        {activeAdminTab === 'services' && <ServiceManagement />}

        {activeAdminTab === 'finance' && (
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold text-stone-900 font-serif-display">Analisis Finansial Platform</h3>
              <button 
                onClick={exportTransactionsToCSV}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-900/10 self-start sm:self-center"
              >
                <Download className="w-3.5 h-3.5" />
                Ekspor Laporan CSV
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-stone-900 text-white rounded-3xl space-y-4">
                <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Total GTV (Gross Transaction Value)</div>
                <div className="text-3xl font-black tracking-tighter">{formatRupiah(totalOmzet)}</div>
              </div>
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-4">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Platform Net Revenue</div>
                <div className="text-3xl font-black text-emerald-950 tracking-tighter">{formatRupiah(platformFee)}</div>
              </div>
            </div>
          </div>
        )}

        {activeAdminTab === 'tariff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl p-8 space-y-8">
              <h3 className="text-xl font-bold text-stone-900 font-serif-display">Pengaturan Layanan & CS</h3>
              <form onSubmit={handleSaveTariff} className="space-y-6">
                
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-stone-800 uppercase tracking-widest border-b border-stone-100 pb-2">Tarif Transportasi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { key: 'baseFare', label: 'Biaya Dasar (Rp)' },
                      { key: 'perKmFare', label: 'Biaya per KM (Rp)' },
                      { key: 'freeRadiusKm', label: 'Radius Bebas (KM)' },
                      { key: 'nightSurcharge', label: 'Insentif Malam (Rp)' }
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">{field.label}</label>
                        <input
                          type="number"
                          value={(tempTariff as any)[field.key]}
                          onChange={(e) => setTempTariff({ ...tempTariff, [field.key]: parseInt(e.target.value) || 0 })}
                          className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-black text-stone-800 uppercase tracking-widest border-b border-stone-100 pb-2">Otomatisasi WhatsApp</h4>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">Nomor WhatsApp CS Utama (Gunakan Kode Negara, e.g. 6285361991731)</label>
                    <input
                      type="text"
                      value={tempWhatsapp}
                      onChange={(e) => setTempWhatsapp(e.target.value)}
                      placeholder="Contoh: 6285361991731"
                      className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <p className="text-[10px] text-stone-400 leading-normal">Nomor ini akan digunakan sebagai hotline utama di tombol bantuan terapung, pengiriman rincian pesanan pelanggan, dan halaman pelacakan terapis.</p>
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-stone-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all">
                  Simpan Konfigurasi
                </button>
              </form>
            </div>

            {/* WA Gateway simulation logs card */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 font-serif-display">Simulasi WA Gateway</h3>
                  <p className="text-[11px] text-stone-500 mt-1">Log pengiriman notifikasi otomatis real-time ke pelanggan & mitra.</p>
                </div>
                {whatsappLogs && whatsappLogs.length > 0 && (
                  <button 
                    onClick={clearWhatsappLogs}
                    className="text-[9px] font-black uppercase text-red-600 hover:text-red-700 underline underline-offset-4 decoration-2"
                  >
                    Hapus Log
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
                {whatsappLogs && whatsappLogs.length > 0 ? (
                  whatsappLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-stone-50 border border-stone-100 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {log.type}
                        </span>
                        <span className="text-stone-400">{log.timestamp}</span>
                      </div>
                      <div className="text-[11px] font-bold text-stone-900">
                        Ke: <span className="text-emerald-600 underline font-mono text-[10px]">{log.recipient}</span>
                      </div>
                      <p className="text-[10px] text-stone-600 leading-relaxed italic bg-white p-3 rounded-xl border border-stone-100 font-medium">
                        "{log.message}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-stone-400">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-20 animate-spin" style={{ animationDuration: '6s' }} />
                    <p className="text-xs font-medium italic">Belum ada aktivitas Gateway otomatis...</p>
                    <p className="text-[9px] text-stone-400 max-w-xs mx-auto mt-2 leading-relaxed">
                      Lakukan pemesanan pijat atau ubah status pesanan menjadi 'Terapis Berjalan', 'Layanan Dimulai' / 'Selesai' untuk melihat simulasi WhatsApp di sini!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeAdminTab === 'inventory' && (
          <div className="space-y-8">
            <InventoryManagement />
            
            {/* Persetujuan Ambil Stok Mitra */}
            {stockRequests && stockRequests.length > 0 && (
              <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 font-serif-display">Persetujuan Ambil Stok Mitra</h3>
                  <p className="text-[11px] text-stone-500 mt-1">Daftar permintaan bahan habis pakai dari mitra terapis di lapangan.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stockRequests.map((req) => (
                    <div 
                      key={req.id} 
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                        req.status === 'approved' ? 'bg-emerald-50/40 border-emerald-100/70' : 
                        req.status === 'rejected' ? 'bg-stone-50 border-stone-100 opacity-65' : 
                        'bg-stone-50/70 border-stone-200/60'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="text-xs font-black text-stone-900">{req.therapistName}</div>
                          <div className="text-[11px] text-stone-500 mt-1">
                            Meminta: <span className="font-bold text-stone-900">{req.itemName}</span>
                          </div>
                          <div className="text-[9px] text-stone-400 mt-1.5 font-mono">ID Permintaan: #{req.id}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-xl block">
                            {req.quantity} Unit
                          </span>
                          <span className={`inline-block mt-2 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'rejected' ? 'bg-stone-200 text-stone-600' :
                            'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {req.status === 'approved' ? 'Disetujui' : req.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                          </span>
                        </div>
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex gap-2 mt-4 pt-3 border-t border-stone-200/40">
                          <button 
                            onClick={() => approveStockRequest(req.id)}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                          >
                            Setujui
                          </button>
                          <button 
                            onClick={() => rejectStockRequest(req.id)}
                            className="px-4 py-2 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl text-[10px] font-bold uppercase transition-all"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Inventory Management Card */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl p-8 space-y-8">
            <div className="flex items-center gap-4 border-b border-stone-100 pb-6 overflow-x-auto no-scrollbar">
              {therapists.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTherapistForInv(t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all min-w-[100px] ${
                    selectedTherapistForInv === t.id ? 'bg-emerald-50 ring-2 ring-emerald-500' : 'hover:bg-stone-50'
                  }`}
                >
                  <img src={t.photoUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <span className="text-[10px] font-bold text-stone-900 whitespace-nowrap">{t.name}</span>
                </button>
              ))}
            </div>

            {selectedTherapistForInv ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-stone-400">Update Stok Mitra</h4>
                  <div className="bg-stone-50 rounded-3xl p-6 space-y-4 border border-stone-100">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase">Pilih Item</label>
                      <select 
                        value={invItemId}
                        onChange={(e) => setInvItemId(e.target.value)}
                        className="w-full bg-white border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                      >
                        <option value="">-- Pilih Barang --</option>
                        {inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase">Jumlah</label>
                        <input type="number" value={invQty} onChange={(e) => setInvQty(parseInt(e.target.value) || 0)} className="w-full bg-white border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase">Kondisi</label>
                        <select value={invCondition} onChange={(e) => setInvCondition(e.target.value as any)} className="w-full bg-white border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none">
                          <option value="good">Baik</option>
                          <option value="worn">Lama</option>
                          <option value="broken">Rusak</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (!invItemId) return;
                        updateTherapistInventory(selectedTherapistForInv, invItemId, invQty, invCondition);
                        setInvItemId('');
                      }}
                      className="w-full py-3 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-800"
                    >
                      Perbarui Inventaris
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-stone-400">Daftar Barang Terpegang</h4>
                  <div className="space-y-2">
                    {therapists.find(t => t.id === selectedTherapistForInv)?.assignedInventory?.map(item => (
                      <div key={item.itemId} className="p-4 bg-white border border-stone-100 rounded-2xl flex justify-between items-center shadow-sm">
                        <div>
                          <div className="text-xs font-bold text-stone-900">{item.name}</div>
                          <div className="text-[9px] text-stone-500 uppercase tracking-tighter">Kondisi: {item.condition}</div>
                        </div>
                        <div className="text-sm font-black text-emerald-600">{item.quantity} Unit</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-stone-400">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="text-xs font-medium italic">Pilih mitra terapis untuk mengelola logistik mereka.</p>
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {/* Modal Add/Edit Therapist */}
      {isTherapistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 p-8 sm:p-12 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsTherapistModalOpen(false)} 
              className="absolute top-8 right-8 p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-stone-400" />
            </button>

            <div className="space-y-2 mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                <Users className="w-3 h-3" />
                <span>Partner Registration</span>
              </div>
              <h3 className="text-3xl font-bold font-serif-display text-stone-900">
                {editingTherapistId ? 'Perbarui Profil Mitra' : 'Daftarkan Mitra Baru'}
              </h3>
              <p className="text-sm text-stone-500 font-medium">
                {editingTherapistId 
                  ? 'Sesuaikan parameter performa dan data personal mitra aktif.' 
                  : 'Buat kredensial akses dan profil profesional untuk mitra terapis baru.'}
              </p>
            </div>

            <form onSubmit={handleSaveTherapist} className="space-y-8">
              {/* Account Credentials Section */}
              <div className="space-y-4 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Kredensial Akses Aplikasi (Email & Password)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">Email Mitra</label>
                    <input 
                      type="email" 
                      value={formEmail} 
                      onChange={(e) => setFormEmail(e.target.value)} 
                      placeholder="email@mimahspa.id"
                      className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">
                      {editingTherapistId ? 'Ganti Kata Sandi (Opsional)' : 'Kata Sandi Sementara'}
                    </label>
                    <input 
                      type="password" 
                      value={formPassword} 
                      onChange={(e) => setFormPassword(e.target.value)} 
                      placeholder={editingTherapistId ? 'Kosongkan jika tidak diubah' : '••••••••'}
                      className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                      {...(!editingTherapistId ? { required: true } : {})}
                    />
                  </div>
                </div>
              </div>

              {/* Personal Data Section */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Informasi Profil Profesional
                </h4>

                {/* Profile Photo Upload / Preset Section */}
                <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200/60 space-y-4">
                  <label className="text-[10px] font-black text-stone-500 uppercase px-1">Foto Profil Terapis</label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Image Preview Container */}
                    <div className="relative group shrink-0">
                      <img 
                        src={formPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'} 
                        alt="Preview Foto" 
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-emerald-500 shadow-md transition-all group-hover:scale-105" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-emerald-600 text-white text-[8px] font-black uppercase rounded-lg tracking-wider border border-white">
                        Preview
                      </span>
                    </div>

                    {/* URL Input & Preset Grid */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">URL Tautan Foto (Kustom)</span>
                        <input 
                          type="text" 
                          value={formPhoto} 
                          onChange={(e) => setFormPhoto(e.target.value)} 
                          placeholder="https://images.unsplash.com/photo-..." 
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-bold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                        />
                      </div>

                      {/* Fast Preset Selector */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Pilih dari Foto Profesional Pilihan</span>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            { gender: 'female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
                            { gender: 'female', url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&auto=format&fit=crop&q=80' },
                            { gender: 'female', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' },
                            { gender: 'female', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80' },
                            { gender: 'male', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80' },
                            { gender: 'male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFormPhoto(preset.url.replace('w=100', 'w=400'))}
                              className={`relative rounded-xl overflow-hidden border-2 transition-all h-10 w-full hover:scale-105 hover:shadow ${
                                formPhoto.includes(preset.url.split('?')[0])
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 animate-pulse'
                                  : 'border-stone-200'
                              }`}
                            >
                              <img src={preset.url} alt="" className="w-full h-full object-cover" />
                              <span className={`absolute top-0 right-0 w-2 h-2 rounded-full ${preset.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">Nama Lengkap (Sesuai KTP)</label>
                    <input 
                      type="text" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                      placeholder="Masukkan nama lengkap..."
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">Nomor WhatsApp Aktif</label>
                    <input 
                      type="text" 
                      value={formPhone} 
                      onChange={(e) => setFormPhone(e.target.value)} 
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">Gender</label>
                    <select 
                      value={formGender} 
                      onChange={(e) => setFormGender(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white transition-all"
                    >
                      <option value="female">Wanita</option>
                      <option value="male">Pria</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">Usia</label>
                    <input 
                      type="number" 
                      value={formAge} 
                      onChange={(e) => setFormAge(parseInt(e.target.value) || 0)} 
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">Porsi Bagi Hasil Mitra (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="1"
                        min="10"
                        max="95"
                        value={formCommission} 
                        onChange={(e) => setFormCommission(parseInt(e.target.value) || 0)} 
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-12 py-3.5 text-sm font-black text-emerald-700 outline-none focus:bg-white transition-all" 
                        placeholder="70"
                        required
                      />
                      <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-[9px] text-stone-400 font-bold px-1 mt-1">Masukkan angka bulat (Misal: 70 = Bagi hasil 70% Mitra & 30% Platform)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">Kota Domisili</label>
                    <select 
                      value={formCity} 
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white transition-all"
                    >
                      {cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-500 uppercase px-1">Kecamatan Tugas</label>
                    <input 
                      type="text" 
                      value={formKecamatan} 
                      onChange={(e) => setFormKecamatan(e.target.value)} 
                      placeholder="Contoh: Medan Baru"
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase px-1">Spesialisasi (Pisahkan dengan koma)</label>
                  <input 
                    type="text" 
                    value={formSpecialties} 
                    onChange={(e) => setFormSpecialties(e.target.value)} 
                    placeholder="Pijat Tradisional, Refleksi Kaki, Totok Wajah..."
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:bg-white transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-500 uppercase px-1">Bio & Pengalaman Singkat</label>
                  <textarea 
                    value={formBio} 
                    onChange={(e) => setFormBio(e.target.value)} 
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-medium text-stone-600 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all min-h-[120px] leading-relaxed" 
                    placeholder="Terapis ramah, teliti dan profesional berpengalaman di area..." 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsTherapistModalOpen(false)}
                  className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-stone-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingTherapistId ? 'Simpan Perubahan' : 'Daftarkan Mitra'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="text-center pt-12 pb-6 space-y-4">
        <div className="flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center text-xs font-black">M</div>
           <span className="text-xs font-black uppercase tracking-[0.3em] text-stone-900">Mimah Spa Operational</span>
        </div>
        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Encoded with high-security standards for Mimah Spa Indonesia</p>
      </div>

    </div>
  );
};
