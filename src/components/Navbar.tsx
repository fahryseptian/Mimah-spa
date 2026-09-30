import React, { useState, useEffect } from 'react';
import { 
  Flower, 
  Sparkles,
  MapPin, 
  UserCheck, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  Menu, 
  X, 
  Settings,
  Search,
  Star,
  TrendingUp,
  Users,
  FileText,
  Package,
  Sliders,
  Tag,
  Coins,
  Wallet,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './Common/PWAInstallButton';
import { supabase } from '../lib/supabase';
import { MEDAN_RADIUS_OPTIONS } from '../types';

export const Navbar: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    selectedCity, 
    setSelectedCity,
    selectedRadiusKm,
    setSelectedRadiusKm, 
    cities, 
    activeCustomerTab, 
    setActiveCustomerTab,
    activeAdminTab,
    setActiveAdminTab,
    setIsBookingModalOpen,
    therapists,
    userPoints,
    setIsLoyaltyModalOpen,
    bookings = [],
    therapistApplications = [],
    logout
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onlineTherapistsCount = therapists.filter(t => t.status === 'online').length;
  const pendingAppsCount = therapistApplications.filter(a => a.status === 'pending').length;
  const activeOrdersCount = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-premium border-b border-stone-100' : 'bg-white border-b border-stone-100'}`}>
      {/* Top Notification Bar */}
      <div className={`text-white text-[10px] sm:text-xs px-4 py-2 font-bold tracking-wider ${userRole === 'therapist' ? 'bg-stone-900 border-b border-stone-800' : 'bg-emerald-800'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            {userRole === 'therapist' ? (
              <>
                <span className="bg-emerald-500 text-stone-900 px-2 py-0.5 rounded-full text-[8px] uppercase font-black">Portal Mitra</span>
                <p className="truncate opacity-90">Sistem Presensi & Manajemen Layanan Terapis Real-Time</p>
              </>
            ) : userRole === 'admin' ? (
              <>
                <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full text-[8px] uppercase font-black">Superadmin Mode</span>
                <p className="truncate opacity-90">Super Administrator (fahryseptian35@gmail.com) • Mimah Spa Command Center</p>
              </>
            ) : (
              <>
                <span className="bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full text-[8px] uppercase font-black">Exclusive</span>
                <p className="truncate opacity-90">Kode <span className="font-mono bg-white/20 px-1.5 rounded">RELAKS50</span>: Diskon Rp 25.000 + Layanan Terapis Berpengalaman!</p>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{onlineTherapistsCount} Terapis Online</span>
            </div>
            <div className="w-px h-3 bg-white/20" />
            <div className="flex items-center gap-1.5 opacity-80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BNSP Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              if (userRole === 'customer') {
                setActiveCustomerTab('katalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className={`w-12 h-12 rounded-[1.25rem] text-white flex items-center justify-center shadow-lg transition-all duration-500 ${
              userRole === 'admin' ? 'bg-stone-900 shadow-stone-900/10' : 
              userRole === 'therapist' ? 'bg-emerald-800 shadow-emerald-900/20' : 
              'bg-emerald-700 shadow-emerald-700/20 group-hover:scale-105'
            }`}>
              <Flower className="w-7 h-7" />
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-xl font-serif-display text-stone-900 leading-none">Mimah Spa</h1>
                {userRole === 'admin' && (
                  <span className="px-1.5 py-0.5 bg-stone-900 text-amber-400 border border-stone-800 rounded-md text-[8px] font-black uppercase tracking-wider">Superadmin</span>
                )}
                {userRole === 'therapist' && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-black uppercase tracking-wider">Mitra Terapis</span>
                )}
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1.5">
                {userRole === 'admin' ? 'Management Portal' : userRole === 'therapist' ? 'Therapist Workstation' : 'Premium Service'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {userRole === 'admin' ? (
              // ADMIN NAVBAR LINKS
              [
                { id: 'analytics', label: 'Dashboard', icon: TrendingUp },
                { id: 'monitoring', label: 'Peta GPS', icon: MapPin },
                { id: 'therapists', label: 'Mitra', icon: Users, badge: pendingAppsCount },
                { id: 'transactions', label: 'Pesanan', icon: FileText, badge: activeOrdersCount },
                { id: 'inventory', label: 'Stok', icon: Package },
                { id: 'services', label: 'Layanan', icon: Sliders },
                { id: 'vouchers', label: 'Voucher', icon: Tag },
                { id: 'finance', label: 'Keuangan', icon: Coins },
                { id: 'settings', label: 'Pengaturan', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`px-3 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 relative cursor-pointer ${
                    activeAdminTab === tab.id
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${activeAdminTab === tab.id ? 'text-emerald-400' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-900 text-[9px] font-black flex items-center justify-center shadow-xs">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              ))
            ) : userRole === 'therapist' ? (
              // THERAPIST WORKSPACE STATUS BADGE
              <div className="flex items-center gap-3 bg-stone-50 px-5 py-2.5 rounded-2xl border border-stone-200/80">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-stone-800">Sesi Workstation Aktif: Dashboard Mitra Terapis</span>
              </div>
            ) : (
              // CUSTOMER NAVBAR LINKS
              [
                { id: 'katalog', label: 'Layanan', icon: Search },
                { id: 'estimasi', label: 'Cek Ongkir', icon: MapPin },
                { id: 'riwayat', label: 'Pesanan Saya', icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCustomerTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeCustomerTab === tab.id
                      ? 'bg-emerald-50 text-emerald-800 shadow-inner border border-emerald-100'
                      : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeCustomerTab === tab.id ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                </button>
              ))
            )}

            {userRole === 'customer' && (
              <>
                <div className="w-px h-8 bg-stone-100 mx-4" />

                {/* Radius Distance Selector */}
                <div className="relative group">
                  <button 
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-950 rounded-2xl border border-emerald-200/60 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Radius {selectedRadiusKm} KM Medan</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-emerald-700 transition-transform ${isCityDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                  </button>
                  
                  <div className={`absolute right-0 top-full mt-3 w-80 bg-white rounded-3xl shadow-premium border border-stone-200/80 p-4 z-50 transition-all ${
                    isCityDropdownOpen 
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0'
                  }`}>
                    <div className="px-2 pb-3 mb-2 border-b border-stone-100">
                      <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Radius Jarak Layanan (Medan)</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Semua kecamatan Medan terlayani berdasarkan jarak radius KM dari pos terapis terdekat (Max 25 KM).
                      </p>
                    </div>

                    <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                      {MEDAN_RADIUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.km}
                          onClick={() => {
                            setSelectedRadiusKm(opt.km);
                            setSelectedCity('Kota Medan');
                            setIsCityDropdownOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                            selectedRadiusKm === opt.km 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs' 
                              : 'bg-stone-50/50 border-stone-100 text-stone-700 hover:bg-stone-100 hover:border-stone-200'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold">{opt.label}</span>
                              {opt.badge && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-500 font-normal">{opt.description}</div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <div className="text-xs font-bold text-emerald-800">
                              ~Rp {(opt.estimatedFee).toLocaleString('id-ID')}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {userRole === 'admin' ? (
              <div className="flex items-center gap-2.5">
                <div className="px-3.5 py-2 bg-stone-900 border border-stone-800 text-stone-200 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Admin Mode</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Keluar dari mode admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : userRole === 'therapist' ? (
              <div className="flex items-center gap-2.5">
                <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Workstation Aktif</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Keluar dari portal terapis"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Portal</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsLoyaltyModalOpen(true)}
                  className="flex items-center gap-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-all active:scale-95 group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center group-hover:rotate-12 transition-transform border border-amber-200">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Loyalty Points</p>
                    <p className="text-sm font-black text-stone-900 leading-none">{userPoints.toLocaleString()}</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveCustomerTab('login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-[1.25rem] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:text-stone-900"
                  title="Masuk Portal Mitra Terapis & Admin"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-500" />
                  <span>Portal Staf</span>
                </button>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-[1.25rem] text-sm font-bold shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2.5"
                >
                  <Calendar className="w-4.5 h-4.5" />
                  <span>Book Now</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Right */}
          <div className="flex lg:hidden items-center gap-3">
            {userRole === 'customer' && (
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-700/10 active:scale-95 transition-all"
              >
                Booking
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 bg-stone-50 text-stone-700 rounded-2xl border border-stone-100 active:scale-95 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 px-6 py-8 space-y-8 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          
          {/* Mobile Loyalty Card - Only for customer */}
          {userRole === 'customer' && (
            <button
              onClick={() => {
                setIsLoyaltyModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-amber-100">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Mimah Points</p>
                  <p className="text-xl font-black text-stone-900 leading-none">{userPoints.toLocaleString()}</p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-amber-400 -rotate-90" />
            </button>
          )}

          {/* Nav Links */}
          <div className="grid grid-cols-1 gap-3">
            {userRole === 'admin' ? (
              // ADMIN MOBILE DRAWER LINKS
              [
                { id: 'analytics', label: 'Dashboard Utama', icon: TrendingUp },
                { id: 'therapists', label: 'Mitra Terapis', icon: Users },
                { id: 'transactions', label: 'Log Transaksi', icon: FileText },
                { id: 'inventory', label: 'Manajemen Stok', icon: Package },
                { id: 'services', label: 'Manajemen Layanan', icon: Sliders },
                { id: 'tariff', label: 'Tarif & CS', icon: Settings },
                { id: 'vouchers', label: 'Voucher Promo', icon: Tag },
                { id: 'finance', label: 'Laporan Laba', icon: Coins },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveAdminTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    activeAdminTab === tab.id
                      ? 'bg-stone-900 border-stone-900 text-white font-bold shadow-md'
                      : 'bg-white border-stone-100 text-stone-600'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeAdminTab === tab.id ? 'text-emerald-400' : 'text-stone-400'}`} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))
            ) : userRole === 'therapist' ? (
              // THERAPIST MOBILE DRAWER
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
                  <p className="text-xs font-bold text-emerald-900">Portal Workstation Mitra Terapis</p>
                  <p className="text-[11px] text-emerald-700">Kelola status pesanan, penjemputan, dan lokasi klien.</p>
                </div>
              </div>
            ) : (
              // CUSTOMER MOBILE DRAWER LINKS
              [
                { id: 'katalog', label: 'Katalog Layanan', icon: Search },
                { id: 'estimasi', label: 'Cek Ongkos Kirim', icon: MapPin },
                { id: 'riwayat', label: 'Riwayat Pesanan', icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCustomerTab(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    activeCustomerTab === tab.id
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                      : 'bg-white border-stone-100 text-stone-600'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeCustomerTab === tab.id ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-stone-100">
            <PWAInstallButton />
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
            {userRole === 'customer' ? (
              <button
                onClick={() => {
                  setActiveCustomerTab('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-4 rounded-2xl text-center text-sm font-bold border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <Settings className="w-5 h-5 text-stone-500" />
                <span>Masuk Portal Staf</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-4 rounded-2xl text-center text-sm font-black uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-rose-600" />
                <span>Keluar dari {userRole === 'admin' ? 'Admin' : 'Portal Terapis'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
