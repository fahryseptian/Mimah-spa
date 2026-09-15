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
  BellRing
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
                      <span className="text-[10px] font-black tracking-widest uppercase">Layanan Wellness & Spa Home Service No. 1 di Medan</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold font-serif-display leading-[1.12] tracking-tight text-stone-900">
                      Pengalaman Spa Bintang Lima,<br />
                      <span className="text-emerald-700">Langsung di Rumah Anda.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl font-medium">
                      Kembalikan kesegaran tubuh dan pikiran tanpa perlu menembus kemacetan. Terapis bersertifikat BNSP kami hadir membawa koper perlengkapan steril, sprei disposable, serta minyak aromaterapi murni langsung ke lokasi Anda.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xl shadow-emerald-700/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2.5"
                      >
                        <span>Pesan Layanan Sekarang</span>
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
                        Eksplor Layanan
                      </button>
                    </div>

                    {/* Trust Proof Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-100">
                      {[
                        { icon: ShieldCheck, label: 'Kualifikasi BNSP', sub: '100% Terapis Resmi' },
                        { icon: Clock, label: 'Tiba Tepat Waktu', sub: 'Estimasi 30-45 Menit' },
                        { icon: Award, label: 'Rating 4.9 / 5.0', sub: '3.800+ Ulasan Puas' },
                        { icon: Heart, label: 'Higienis Medis', sub: 'Kit Steril & Disposable' },
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
                    Kalkulator & Simulasi Ongkos Transportasi Terapis
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
        <footer className="mt-24 bg-white border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Col 1: Brand & Disclaimer */}
              <div className="md:col-span-5 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold font-serif-display text-xl">
                    M
                  </div>
                  <div>
                    <span className="text-xl font-bold text-stone-900 font-serif-display tracking-tight block">
                      Mimah Spa
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                      Premium Home Service
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-stone-500 leading-relaxed font-medium">
                  Platform reservasi terapis kebugaran & kesehatan profesional bersertifikat BNSP. Kami menghadirkan standar spa bintang lima langsung ke rumah Anda khusus untuk wanita & keluarga.
                </p>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-semibold italic">
                    ⚠️ "Mimah Spa secara ketat hanya menyediakan layanan terapi kebugaran profesional. Segala bentuk pelanggaran etika & norma kesopanan akan kami proses secara hukum."
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: Services */}
              <div className="md:col-span-3 space-y-6">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Layanan Utama</h4>
                <ul className="space-y-4">
                  {['Pijat Tradisional', 'Refleksi Kaki', 'Deep Tissue Sport', 'Ibu Hamil & Bayi', 'Fisioterapi'].map((item) => (
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
                        className="text-sm font-bold text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer text-left"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Support */}
              <div className="md:col-span-4 space-y-8">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Hubungi Kami</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">WhatsApp Hotline</p>
                        <p className="text-sm font-bold text-stone-900">+62 853-6199-1731</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
                        <Clock className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Jam Operasional</p>
                        <p className="text-sm font-bold text-stone-900">09.00 - 20.00 WIB (Setiap Hari)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Metode Pembayaran</h4>
                  <div className="flex flex-wrap gap-2">
                    {['BCA', 'Mandiri', 'GoPay', 'OVO', 'ShopeePay', 'QRIS'].map((bank) => (
                      <span key={bank} className="px-3 py-1 rounded-lg bg-stone-50 border border-stone-100 text-[10px] font-bold text-stone-500">{bank}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-20 pt-8 border-t border-stone-50 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] font-bold text-stone-400">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span>© {new Date().getFullYear()} Mimah Spa Indonesia</span>
                <div className="w-1 h-1 rounded-full bg-stone-200 hidden sm:block" />
                <button onClick={() => { setTermsTab('terms'); setIsTermsOpen(true); }} className="hover:text-emerald-700 transition-colors uppercase tracking-widest">Syarat & Ketentuan</button>
                <div className="w-1 h-1 rounded-full bg-stone-200" />
                <button onClick={() => { setTermsTab('refund'); setIsTermsOpen(true); }} className="hover:text-emerald-700 transition-colors uppercase tracking-widest text-emerald-700 font-black">Kebijakan Refund</button>
                <div className="w-1 h-1 rounded-full bg-stone-200" />
                <button onClick={() => { setTermsTab('privacy'); setIsTermsOpen(true); }} className="hover:text-emerald-700 transition-colors uppercase tracking-widest">Privasi PDP</button>
                <div className="w-1 h-1 rounded-full bg-stone-200" />
                <button onClick={() => { setTermsTab('careers'); setIsTermsOpen(true); }} className="hover:text-emerald-700 transition-colors uppercase tracking-widest text-emerald-600 font-extrabold">Karir & Kemitraan</button>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-emerald-600/60">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>BNSP Certified</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600/60">
                  <Sparkles className="w-3.5 h-3.5" />
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
