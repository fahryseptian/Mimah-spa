import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  Flower,
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Heart, 
  CheckCircle, 
  Award,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Send,
  Building,
  BellRing,
  Instagram,
  Mail,
  MessageCircle
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { ServiceCatalog } from './components/Services/ServiceCatalog';
// import { TherapistList } from './components/Therapists/TherapistList';
import { TherapistDetailModal } from './components/Therapists/TherapistDetailModal';
import { TransportCalculator } from './components/Booking/TransportCalculator';
import { BookingWizard } from './components/Booking/BookingWizard';
import { BookingTracking } from './components/Booking/BookingTracking';
import { TherapistDashboard } from './components/TherapistPortal/TherapistDashboard';
import { AdminManagement } from './components/Admin/AdminManagement';
import { SafetyBanner } from './components/SafetyBanner';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { QuickBookingBar } from './components/Landing/QuickBookingBar';
import { PromoVoucherStrip } from './components/Landing/PromoVoucherStrip';
import { HowItWorks } from './components/Landing/HowItWorks';
// import { FeaturedTherapists } from './components/Landing/FeaturedTherapists';
import { CustomerReviewsSection } from './components/Landing/CustomerReviewsSection';
import { LandingFaq } from './components/Landing/LandingFaq';
import { SterilizationGallery } from './components/Landing/SterilizationGallery';
import { ReferralBanner } from './components/Landing/ReferralBanner';
import { LoyaltyRewardsModal } from './components/Loyalty/LoyaltyRewardsModal';
import { TermsModal } from './components/TermsModal';
import { OfflineIndicator } from './components/Common/OfflineIndicator';
import { ShareButton } from './components/Common/ShareButton';
import { InstallPwaOverlay } from './components/Common/InstallPwaOverlay';
import { StatusNotificationOverlay } from './components/Common/StatusNotificationOverlay';
import { MapsWrapper } from './components/Maps/MapsWrapper';
import { ServiceAreaMap } from './components/Maps/ServiceAreaMap';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const MainContent: React.FC = () => {
  const { 
    userRole, 
    setUserRole,
    activeCustomerTab, 
    setActiveCustomerTab, 
    selectedCity, 
    isBookingModalOpen, 
    setIsBookingModalOpen,
    cities,
    user,
    loading,
    bookings,
    activeBooking,
    setActiveBooking
  } = useApp();

  const [isTermsOpen, setIsTermsOpen] = React.useState(false);
  const [termsTab, setTermsTab] = React.useState<'terms' | 'refund' | 'privacy'>('terms');

  // Normalize current tab with fallback to 'katalog'
  const currentTab = activeCustomerTab || 'katalog';

  // NEW: Notification listener for booking status changes
  const lastStatuses = React.useRef<Record<string, string>>({});

  React.useEffect(() => {
    bookings.forEach(booking => {
      const prevStatus = lastStatuses.current[booking.id];
      if (prevStatus && prevStatus !== booking.status) {
        // Status changed!
        let message = '';
        let title = 'Update Pesanan';
        
        switch (booking.status) {
          case 'confirmed':
            title = 'Pesanan Dikonfirmasi';
            message = `Terapis ${booking.therapistName || ''} telah ditugaskan untuk pesanan #${booking.bookingCode}.`;
            break;
          case 'therapist_on_the_way':
            title = 'Terapis Menuju Lokasi';
            message = `Terapis sedang dalam perjalanan menuju alamat Anda.`;
            break;
          case 'therapist_arrived':
            title = 'Terapis Telah Tiba';
            message = `Terapis sudah sampai di depan lokasi Anda. Silakan temui terapis.`;
            break;
          case 'in_session':
            title = 'Sesi Dimulai';
            message = `Sesi ${booking.serviceTitle} Anda telah dimulai. Selamat menikmati!`;
            break;
          case 'completed':
            title = 'Sesi Selesai';
            message = `Terima kasih telah menggunakan Mimah Spa. Berikan rating untuk terapis Anda!`;
            break;
          case 'cancelled':
            title = 'Pesanan Dibatalkan';
            message = `Pesanan #${booking.bookingCode} telah dibatalkan.`;
            break;
        }

        if (message) {
          toast(title, {
            description: message,
            icon: <BellRing className="w-4 h-4 text-emerald-600" />,
            action: {
              label: 'Lihat Detail',
              onClick: () => {
                setActiveBooking(booking);
                setActiveCustomerTab('tracking');
              }
            }
          });
        }
      }
      lastStatuses.current[booking.id] = booking.status;
    });
  }, [bookings, setActiveBooking, setActiveCustomerTab]);

  React.useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) console.error('Supabase connection error:', error.message);
        else console.log('Supabase connected successfully');
      });
    }
  }, []);

  React.useEffect(() => {
    if (user && activeCustomerTab === 'login') {
      setActiveCustomerTab('katalog');
    }
  }, [user, activeCustomerTab, setActiveCustomerTab]);

  // Deep link listener for private portal access and direct booking
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'admin') {
      // Force reset to customer role and login tab for access
      setUserRole('customer');
      setActiveCustomerTab('login');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('pesan') === 'true') {
      // Open booking modal automatically
      setIsBookingModalOpen(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('id')) {
      // Switch to tracking tab automatically for booking ID
      setActiveCustomerTab('tracking');
    } else if (params.get('tab')) {
      const tab = params.get('tab');
      if (tab) setActiveCustomerTab(tab as any);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setActiveCustomerTab, setUserRole, setIsBookingModalOpen]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Memuat...</div>;

  if (!supabase) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col items-center justify-center p-6 sm:p-12 font-sans selection:bg-rose-200 selection:text-rose-900">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] border border-stone-200 shadow-premium p-8 sm:p-12 space-y-8 relative overflow-hidden">
          {/* Background decorative accent */}
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-80 h-80 bg-rose-50 rounded-full blur-[80px] pointer-events-none opacity-60" />
          
          <div className="space-y-4 relative z-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-100/50 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase">Koneksi Database Diperlukan</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-serif-display leading-tight tracking-tight">
              Aplikasi Berjalan dalam <br />
              <span className="text-rose-600">Mode Cloud Supabase Ketat</span>
            </h1>

            <p className="text-sm text-stone-500 leading-relaxed font-medium">
              Mode penyimpanan lokal telah dinonaktifkan sesuai permintaan Anda. Untuk dapat menggunakan portal Mimah Spa, Anda wajib menghubungkan aplikasi ke database Supabase nyata.
            </p>
          </div>

          <div className="space-y-4 bg-stone-50 p-6 rounded-2xl border border-stone-100">
            <h3 className="text-xs font-black text-stone-700 uppercase tracking-widest">Cara Menghubungkan Database</h3>
            <ol className="text-xs text-stone-600 space-y-3 font-medium list-decimal list-inside">
              <li>Buat file bernama <code className="px-1.5 py-0.5 bg-stone-200 text-rose-600 rounded font-mono font-bold">.env</code> di direktori root proyek Anda.</li>
              <li>Salin dan isi variabel berikut dengan kredensial proyek Supabase Anda:</li>
            </ol>

            <div className="mt-4 p-4 bg-stone-900 rounded-xl font-mono text-[11px] text-stone-300 relative select-all leading-relaxed whitespace-pre overflow-x-auto">
{`# File: .env (Salin Kunci Ini)
VITE_SUPABASE_URL=Masukkan_URL_Proyek_Supabase_Anda
VITE_SUPABASE_ANON_KEY=Masukkan_Anon_Key_Supabase_Anda`}
            </div>
          </div>

          <div className="pt-2 text-center sm:text-left">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider leading-relaxed">
              *Setelah mengonfigurasi berkas .env, harap restart development server atau refresh halaman ini untuk mengaktifkan koneksi database.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Remove unconditional redirect to LoginPage here. 
  // We will handle login status in the UI (e.g., in Navbar or on specific actions).

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 1: CUSTOMER PORTAL */}
        {userRole === 'customer' && (
          <div className="space-y-12">
            
            {/* HERO & MAIN LANDING SECTION */}
            {(currentTab === 'katalog' || currentTab === 'services') && (
              <div className="space-y-16">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white text-stone-900 p-8 sm:p-14 border border-stone-100 shadow-premium">
                  {/* Background decorative accents */}
                  <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[32rem] h-[32rem] bg-emerald-50 rounded-full blur-[100px] pointer-events-none opacity-70" />
                  <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-50 rounded-full blur-[90px] pointer-events-none opacity-40" />
                  
                  <div className="relative z-10 max-w-3xl space-y-8">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100/80 shadow-xs backdrop-blur-sm">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span className="text-[10px] font-black tracking-widest uppercase">Pijat & Spa Home Service Keluarga No. 1 di Medan</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold font-serif-display leading-[1.12] tracking-tight text-stone-900">
                      Pengalaman Spa Bintang Lima,<br />
                      <span className="text-emerald-700">Langsung di Rumah Anda.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl font-medium">
                      Pulihkan kesegaran tubuh dan pikiran tanpa perlu keluar rumah atau menembus kemacetan Medan. Terapis wanita terverifikasi BNSP hadir membawa koper perlengkapan steril, sprei <em>disposable</em> sekali buang, serta minyak aromaterapi murni langsung ke lokasi Anda.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xl shadow-emerald-700/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2.5"
                      >
                        <span>Pesan Spa Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const el = document.getElementById('services');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            setActiveCustomerTab('katalog');
                          }
                        }}
                        className="px-7 py-4 rounded-2xl bg-white text-stone-700 font-bold text-sm border border-stone-200 hover:bg-stone-50 hover:border-emerald-300 transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        Lihat Katalog & Tarif
                      </button>
                    </div>

                    {/* Trust Proof Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-100">
                      {[
                        { icon: ShieldCheck, label: 'Sertifikasi BNSP', sub: 'Terapis Wanita Resmi' },
                        { icon: Clock, label: 'Tiba Tepat Waktu', sub: 'Estimasi 30-45 Menit' },
                        { icon: Award, label: 'Rating 4.9 / 5.0', sub: '3.800+ Pelanggan Medan' },
                        { icon: Heart, label: 'Higienis & Steril', sub: 'Kit Disposable Sekali Pakai' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50/60 border border-stone-100">
                          <item.icon className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <div className="font-bold text-[11px] text-stone-900 leading-tight">{item.label}</div>
                            <div className="text-[9px] text-stone-500 font-medium leading-tight mt-0.5">{item.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Integrated Quick Booking Bar */}
                    <div className="pt-4">
                      <QuickBookingBar />
                    </div>
                  </div>
                </div>

                {/* 3 Steps Easy Order */}
                <HowItWorks />

                {/* Promotional and Voucher Showcase Section */}
                <PromoVoucherStrip />

                {/* Service Catalog */}
                <ServiceCatalog />

                {/* Active Therapists Showcase */}
                {/* <FeaturedTherapists /> */}

                {/* Safety, Hygiene, Ethics Standard */}
                <SafetyBanner />

                {/* Customer Testimonials & Reviews */}
                <CustomerReviewsSection />

                {/* Referral Program Banner */}
                <ReferralBanner />

                {/* Sterilization Gallery Showcase */}
                <SterilizationGallery />

                {/* Frequently Asked Questions */}
                <LandingFaq />
              </div>
            )}

            {/* TAB: TRANSPORT CALCULATOR */}
            {(currentTab === 'estimasi' || currentTab === 'calculator') && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-xs">
                  <h2 className="text-xl font-bold font-serif-display text-stone-900">
                    Kalkulator Transparan Tarif Transportasi Terapis
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Hitung estimasi transparan ongkos bensin motor terapis menuju alamat rumah, kos, hotel, atau apartemen Anda di Medan berdasarkan radius jarak lokasi Anda.
                  </p>
                </div>

                <TransportCalculator />
              </div>
            )}

            {/* TAB: LIVE TRACKING & HISTORY */}
            {(currentTab === 'riwayat' || currentTab === 'tracking') && (
              <BookingTracking />
            )}

            {/* TAB: SOP & PROTOCOL */}
            {currentTab === 'sop' && (
              <div className="space-y-6">
                <SafetyBanner />
              </div>
            )}

            {/* TAB: LOGIN */}
            {currentTab === 'login' && (
              <LoginPage />
            )}

          </div>
        )}

        {/* VIEW 2: THERAPIST PARTNER PORTAL */}
        {userRole === 'therapist' && (
          <TherapistDashboard />
        )}

        {/* VIEW 3: ADMIN MANAGEMENT PORTAL */}
        {userRole === 'admin' && (
          <AdminManagement />
        )}

      </main>

      {/* Global Modals */}
      {isBookingModalOpen && <BookingWizard />}
      <LoyaltyRewardsModal />
      <TherapistDetailModal />

      {/* WhatsApp Floating Widget - Only for Customer */}
      {userRole === 'customer' && <WhatsAppFloatingButton />}

      {/* Footer - Only for Customer */}
      {userRole === 'customer' && (
        <footer className="mt-24 bg-white border-t border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            
            {/* Top Footer Callout Card */}
            <div className="mb-16 p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-r from-stone-900 via-stone-850 to-emerald-950 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2 text-center lg:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solusi Relaksasi Keluarga</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
                  Siap Merasakan Sensasi Spa Bintang Lima di Rumah?
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-medium">
                  Terapis wanita bersertifikat BNSP kami siap hadir membawa koper higienis steril ke lokasi Anda di Kota Medan.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 relative z-10">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/6285361991731?text=Halo%20Admin%20Mimah%20Spa,%20saya%20ingin%20tanya%20layanan%20home%20service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
              
              {/* Col 1: Brand & Disclaimer */}
              <div className="md:col-span-4 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold font-serif-display text-xl shadow-md">
                    M
                  </div>
                  <div>
                    <span className="text-xl font-bold text-stone-900 font-serif-display tracking-tight block">
                      Mimah Spa
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">
                      Premium Home Service Medan
                    </span>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  Platform reservasi terapis kebugaran & kesehatan wanita terverifikasi BNSP resmi No. 1 di Kota Medan. Bebas macet, steril higienis, dan nyaman untuk keluarga.
                </p>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
                  <p className="text-[11px] text-emerald-900 leading-relaxed font-semibold italic">
                    ⚠️ "Mimah Spa secara ketat hanya melayani terapi kesehatan profesional. Segala bentuk tindakan melanggar norma hukum & kesopanan akan kami tindak tegas."
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://wa.me/6285361991731"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:info@mimahspa.com"
                    className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-center text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Col 2: Services */}
              <div className="md:col-span-3 space-y-4">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Katalog Perawatan</h4>
                <ul className="space-y-3">
                  {[
                    'Pijat Tradisional Sehat',
                    'Refleksi Kaki & Tangan',
                    'Deep Tissue & Sport Massage',
                    'Pijat Ibu Hamil & Bayi',
                    'Bekam Medis & Kerokan',
                    'Totok Wajah & Lulur Spa',
                    'Fisioterapi Kesehatan'
                  ].map((item) => (
                    <li key={item}>
                      <button 
                        onClick={() => {
                          const el = document.getElementById('services');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            setActiveCustomerTab('katalog');
                          }
                        }}
                        className="text-xs font-bold text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Legal & Kemitraan */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Legalitas & Karir</h4>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => { setTermsTab('terms'); setIsTermsOpen(true); }}
                      className="text-xs font-bold text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                    >
                      Syarat & Ketentuan
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setTermsTab('refund'); setIsTermsOpen(true); }}
                      className="text-xs font-bold text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                    >
                      Kebijakan Refund
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setTermsTab('privacy'); setIsTermsOpen(true); }}
                      className="text-xs font-bold text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                    >
                      Privasi PDP
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => { setTermsTab('careers'); setIsTermsOpen(true); }}
                      className="text-xs font-bold text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                    >
                      Karir & Kemitraan
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 4: Support & Payment */}
              <div className="md:col-span-3 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Layanan Pelanggan</h4>
                  <div className="space-y-3">
                    <a 
                      href="https://wa.me/6285361991731"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 border border-stone-100 hover:border-emerald-200 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-stone-100 shadow-xs group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        <Phone className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Hotline CS WhatsApp</p>
                        <p className="text-xs font-extrabold text-stone-900 group-hover:text-emerald-800">+62 853-6199-1731</p>
                      </div>
                    </a>
                    
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-stone-100 shadow-xs">
                        <Clock className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Jam Operasional</p>
                        <p className="text-xs font-extrabold text-stone-900">09.00 - 20.00 WIB (Setiap Hari)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Pembayaran Resmi</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['QRIS', 'BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'OVO', 'ShopeePay'].map((bank) => (
                      <span key={bank} className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200/60 text-[10px] font-bold text-stone-600">
                        {bank}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] font-bold text-stone-400">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span>© {new Date().getFullYear()} Mimah Spa Indonesia • Layanan Spa Panggilan Keluarga Medan</span>
                <div className="w-1 h-1 rounded-full bg-stone-300 hidden sm:block" />
                <button onClick={() => { setActiveCustomerTab('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-700 transition-colors uppercase tracking-widest text-stone-500 font-bold">Portal Staf</button>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>BNSP Certified</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Standard Kemenkes</span>
                </div>
              </div>
            </div>

          </div>
        </footer>
      )}

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} defaultTab={termsTab} />
      <OfflineIndicator />
      <InstallPwaOverlay />
      <StatusNotificationOverlay />
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MapsWrapper 
        apiKey={GOOGLE_MAPS_API_KEY}
        libraries={['places', 'marker', 'geometry']}
      >
        <MainContent />
      </MapsWrapper>
    </AppProvider>
  );
}

export default App;
