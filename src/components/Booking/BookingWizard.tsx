import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  Building2, 
  Plus, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Banknote, 
  QrCode, 
  Send, 
  Flame, 
  Copy,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { INITIAL_SERVICES } from '../../data/mockData';
import { 
  ServiceItem, 
  Therapist, 
  PlaceType, 
  PaymentMethod, 
  TherapistGenderPreference 
} from '../../types';
import { 
  calculateTransportFare, 
  getOilOptions, 
  getPressureOptions,
  generateWhatsAppBookingMessage,
  findNearestAvailableTherapist,
  generateGoogleCalendarUrl
} from '../../utils/formatters';
import { TermsModal } from '../TermsModal';
import { LocationPickerMap } from './LocationPickerMap';
import { BookingStepService } from './BookingStepService';
import { BookingStepAddOns } from './BookingStepAddOns';
import { BookingStepTherapist } from './BookingStepTherapist';
import { BookingStepSchedule } from './BookingStepSchedule';
import { BookingStepDetails } from './BookingStepDetails';

export const BookingWizard: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    services, 
    addOns, 
    therapists, 
    cities, 
    selectedCity, 
    selectedKecamatan,
    tariffConfig, 
    vouchers,
    selectedServiceForBooking, 
    selectedTherapistForBooking, 
    createBooking,
    setActiveBooking,
    setActiveCustomerTab,
    showToast,
    whatsappNumber
  } = useApp();

  // Wizard Step State
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyDetails = (booking: any) => {
    const msg = decodeURIComponent(generateWhatsAppBookingMessage(booking));
    navigator.clipboard.writeText(msg);
    setIsCopied(true);
    showToast('Rincian booking disalin ke clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Step 1: Service & Preferences
  const [selectedService, setSelectedService] = useState<ServiceItem>(() => {
    return selectedServiceForBooking || services[0] || INITIAL_SERVICES[0];
  });
  const [selectedDuration, setSelectedDuration] = useState<number>(() => {
    return selectedService?.durationOptions?.[0]?.durationMinutes || 90;
  });
  const [selectedOil, setSelectedOil] = useState<string>('Minyak Zaitun + Aroma Lavender');

  // Step 2: Add-ons
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Step 3: Therapist Choice
  const [therapistSelectionMode, setTherapistSelectionMode] = useState<'auto' | 'specific'>('auto');
  const [genderPreference, setGenderPreference] = useState<TherapistGenderPreference>('female');
  const [chosenTherapistId, setChosenTherapistId] = useState<string | null>(() => {
    return selectedTherapistForBooking ? selectedTherapistForBooking.id : null;
  });

  // Step 4: Schedule & Location
  const [bookingDate, setBookingDate] = useState<string>('Hari Ini');
  const [customDate, setCustomDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('14:00');
  const [clientCity, setClientCity] = useState<string>(selectedCity);
  const [clientKecamatan, setClientKecamatan] = useState<string>(selectedKecamatan);
  const [address, setAddress] = useState<string>('');
  const [addressNotes, setAddressNotes] = useState<string>('');
  const [placeType, setPlaceType] = useState<PlaceType>('rumah');
  const [distanceKm, setDistanceKm] = useState<number>(3.5);
  const [isRainy, setIsRainy] = useState<boolean>(false);

  // Step 5: Customer Details & Payment
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerGender, setCustomerGender] = useState<'male' | 'female'>('female');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [voucherCodeInput, setVoucherCodeInput] = useState<string>('');
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);

  // Completed Booking State
  const [completedBooking, setCompletedBooking] = useState<any | null>(null);

  // Sync if preselected props change
  useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedService(selectedServiceForBooking);
      setSelectedDuration(selectedServiceForBooking.durationOptions?.[0]?.durationMinutes || 90);
    } else if (services && services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
      setSelectedDuration(services[0].durationOptions?.[0]?.durationMinutes || 90);
    }
  }, [selectedServiceForBooking, services]);

  useEffect(() => {
    if (selectedTherapistForBooking) {
      setTherapistSelectionMode('specific');
      setChosenTherapistId(selectedTherapistForBooking.id);
      setGenderPreference(selectedTherapistForBooking.gender);
    }
  }, [selectedTherapistForBooking]);

  if (!isBookingModalOpen) return null;

  // Pricing calculations
  const durationOptionsList = (selectedService?.durationOptions && selectedService.durationOptions.length > 0)
    ? selectedService.durationOptions
    : [{ durationMinutes: 90, price: 135000, popular: true }];

  const durationObj = durationOptionsList.find(d => d.durationMinutes === selectedDuration) || durationOptionsList[0];
  const servicePrice = durationObj ? durationObj.price : 135000;

  const chosenAddOns = useMemo(() => 
    addOns.filter(a => selectedAddOnIds.includes(a.id)),
    [addOns, selectedAddOnIds]
  );
  const addOnsTotal = useMemo(() => 
    chosenAddOns.reduce((sum, a) => sum + a.price, 0),
    [chosenAddOns]
  );

  const transportBreakdown = useMemo(() => 
    calculateTransportFare(distanceKm, timeSlot, isRainy, placeType, tariffConfig),
    [distanceKm, timeSlot, isRainy, placeType, tariffConfig]
  );
  const transportCost = transportBreakdown.totalTransport;

  const subtotal = servicePrice + addOnsTotal + transportCost;

  // Voucher calculation
  const voucherDiscount = useMemo(() => {
    if (!appliedVoucherCode) return 0;
    const voucher = vouchers.find(v => v.code.toUpperCase() === appliedVoucherCode.toUpperCase());
    if (!voucher) return 0;
    
    if (voucher.discountAmount) {
      return voucher.discountAmount;
    } else if (voucher.discountPercent) {
      const calculated = Math.round((subtotal * voucher.discountPercent) / 100);
      return voucher.maxDiscount ? Math.min(calculated, voucher.maxDiscount) : calculated;
    }
    return 0;
  }, [appliedVoucherCode, vouchers, subtotal]);

  const grandTotal = Math.max(0, subtotal - voucherDiscount);

  // Available therapists for chosen gender and city
  const matchedTherapists = useMemo(() => therapists.filter(t => {
    const matchesGender = genderPreference === 'any' || t.gender === genderPreference;
    return matchesGender && t.status === 'online';
  }), [therapists, genderPreference]);

  const assignedTherapist = useMemo(() => {
    if (therapistSelectionMode === 'specific' && chosenTherapistId) {
      return therapists.find(t => t.id === chosenTherapistId) || matchedTherapists[0] || therapists[0];
    }
    // Automatically find nearest available online therapist using GPS/Haversine
    return findNearestAvailableTherapist(therapists, 3.5952, 98.6722);
  }, [therapistSelectionMode, chosenTherapistId, therapists, matchedTherapists]);

  const handleApplyVoucher = useCallback(() => {
    const found = vouchers.find(v => v.code.toUpperCase() === voucherCodeInput.trim().toUpperCase());
    if (found) {
      setAppliedVoucherCode(found.code);
    } else {
      showToast('Kode voucher tidak ditemukan atau telah kedaluwarsa.', 'error');
    }
  }, [vouchers, voucherCodeInput, showToast]);

  const handleToggleAddOn = useCallback((id: string) => {
    setSelectedAddOnIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const handleFinalSubmit = useCallback(async () => {
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      showToast('Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Lengkap Anda.', 'error');
      return;
    }
    
    if (customerPhone.trim().length < 10) {
      showToast('Nomor WhatsApp tidak valid.', 'error');
      return;
    }

    setIsSubmitting(true);

    let paymentUrl = '';
    let finalPaymentStatus: 'pending' | 'paid' = paymentMethod === 'cash' ? 'pending' : 'pending';

    // Call Xendit API for online payments
    if (paymentMethod === 'qris' || paymentMethod === 'transfer') {
      try {
        const response = await fetch('/api/create-xendit-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            externalId: `mimah-spa-${Date.now()}`,
            amount: grandTotal,
            payerEmail: customerEmail || 'customer@mimahspa.com',
            description: `Pembayaran ${selectedService.title} - Mimah Spa`
          })
        });
        const data = await response.json();
        if (data.success) {
          paymentUrl = data.invoiceUrl;
        }
      } catch (error) {
        console.error('Xendit Error:', error);
      }
    }

    const bookingPayload = {
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      durationMinutes: selectedDuration,
      servicePrice,
      selectedAddOns: chosenAddOns.map(a => ({
        id: a.id,
        name: a.name,
        price: a.price,
        durationMinutes: a.durationMinutes,
      })),
      therapistId: assignedTherapist?.id,
      therapistName: assignedTherapist?.name,
      therapistGenderPreference: genderPreference,
      therapistPhoto: assignedTherapist?.photoUrl,
      therapistPhone: assignedTherapist?.phone,
      customerName,
      customerPhone,
      customerGender,
      customerEmail,
      bookingDate: bookingDate === 'Pilih Tanggal' ? (customDate || 'Jadwal Ditentukan') : bookingDate,
      bookingTimeSlot: timeSlot,
      city: clientCity,
      kecamatan: clientKecamatan,
      address,
      addressNotes,
      placeType,
      estimatedDistanceKm: distanceKm,
      transportCost,
      transportBreakdown,
      voucherCode: appliedVoucherCode || undefined,
      voucherDiscount,
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: finalPaymentStatus,
      paymentUrl: paymentUrl || undefined,
      specialNotes,
      selectedOil,
    };

    const created = createBooking(bookingPayload);
    setCompletedBooking(created);
    setStep(6);
    setIsSubmitting(false);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#d97706', '#f59e0b'],
      });
    } catch (e) {
      console.error(e);
    }
  }, [
    customerName, customerPhone, address, showToast, selectedService, 
    selectedDuration, servicePrice, chosenAddOns, assignedTherapist, 
    genderPreference, customerGender, customerEmail, bookingDate, 
    customDate, timeSlot, clientCity, clientKecamatan, addressNotes, 
    placeType, distanceKm, transportCost, transportBreakdown, 
    appliedVoucherCode, voucherDiscount, grandTotal, paymentMethod, 
    specialNotes, selectedOil, createBooking
  ]);

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setStep(1);
    setCompletedBooking(null);
  };

  const oilOptions = getOilOptions();
  const pressureOptions = getPressureOptions();
  const focusAreaOptions = [
    'Punggung & Pundak',
    'Pinggang & Pinggul',
    'Betis & Telapak Kaki',
    'Leher & Kepala',
    'Lengan & Telapak Tangan',
    'Dada & Perut (Khusus Pijat Sehat)',
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-soft-hover border border-stone-100 flex flex-col justify-between"
      >
        
        {/* Wizard Header */}
        <div className="bg-white text-stone-900 p-5 sm:p-6 rounded-t-3xl sticky top-0 z-20 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                {step < 6 ? step : '✓'}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-serif-display">
                  {step === 1 && '1. Pilih Layanan & Preferensi Terapi'}
                  {step === 2 && '2. Tambah Perawatan Tradisional (Add-on)'}
                  {step === 3 && '3. Preferensi & Penugasan Terapis'}
                  {step === 4 && '4. Jadwal & Lokasi Home Service'}
                  {step === 5 && '5. Data Pemesan & Pembayaran'}
                  {step === 6 && 'Pemesanan Berhasil Dikonfirmasi! 🎉'}
                </h2>
                <p className="text-xs text-stone-500">
                  {step < 6 ? `Langkah ${step} dari 5 • Home Service Terpercaya` : `Kode Booking: #${completedBooking?.bookingCode}`}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Bar */}
          {step < 6 && (
            <div className="grid grid-cols-5 gap-1.5 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    step >= i ? 'bg-emerald-500' : 'bg-stone-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 space-y-6 flex-1 text-stone-800">

          {/* Real-time Cost Summary Header (Visible at all steps) */}
          <div className="bg-emerald-50 text-emerald-950 p-4 rounded-2xl flex items-center justify-between border border-emerald-100">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Estimasi Total Biaya:</span>
            <span className="text-sm font-extrabold text-emerald-700">{formatRupiah(grandTotal)}</span>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* STEP 1: Service Selection */}
              {step === 1 && (
                <BookingStepService
                  services={services}
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  selectedDuration={selectedDuration}
                  setSelectedDuration={setSelectedDuration}
                  selectedOil={selectedOil}
                  setSelectedOil={setSelectedOil}
                  oilOptions={oilOptions}
                />
              )}

              {/* STEP 2: Add-ons */}
              {step === 2 && (
                <BookingStepAddOns
                  addOns={addOns}
                  selectedAddOnIds={selectedAddOnIds}
                  handleToggleAddOn={handleToggleAddOn}
                />
              )}

              {/* STEP 3: Automated Therapist Assignment */}
              {step === 3 && (
                <BookingStepTherapist
                  selectionMode={therapistSelectionMode}
                  setSelectionMode={setTherapistSelectionMode}
                  genderPreference={genderPreference}
                  setGenderPreference={setGenderPreference}
                  chosenTherapistId={chosenTherapistId}
                  setChosenTherapistId={setChosenTherapistId}
                  matchedTherapists={matchedTherapists}
                  assignedTherapist={assignedTherapist}
                />
              )}

          {/* STEP 4: Schedule, Address, Distance & Transport */}
          {step === 4 && (
            <BookingStepSchedule
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              customDate={customDate}
              setCustomDate={setCustomDate}
              timeSlot={timeSlot}
              setTimeSlot={setTimeSlot}
              address={address}
              setAddress={setAddress}
              clientKecamatan={clientKecamatan}
              setClientKecamatan={setClientKecamatan}
              distanceKm={distanceKm}
              setDistanceKm={setDistanceKm}
              placeType={placeType}
              setPlaceType={setPlaceType}
              addressNotes={addressNotes}
              setAddressNotes={setAddressNotes}
              transportCost={transportCost}
              originKecamatan={assignedTherapist?.baseKecamatan || 'Medan Baru'}
              therapistName={assignedTherapist?.name}
            />
          )}

          {/* STEP 5: Customer Form & Payment Method */}
          {step === 5 && (
            <BookingStepDetails
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerPhone={customerPhone}
              setCustomerPhone={setCustomerPhone}
              specialNotes={specialNotes}
              setSpecialNotes={setSpecialNotes}
              voucherCodeInput={voucherCodeInput}
              setVoucherCodeInput={setVoucherCodeInput}
              handleApplyVoucher={handleApplyVoucher}
              appliedVoucherCode={appliedVoucherCode}
              voucherDiscount={voucherDiscount}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              hasAgreedToTerms={hasAgreedToTerms}
              setHasAgreedToTerms={setHasAgreedToTerms}
              setIsTermsOpen={setIsTermsOpen}
              grandTotal={grandTotal}
              servicePrice={servicePrice}
              chosenAddOns={chosenAddOns}
              addOnsTotal={addOnsTotal}
              transportCost={transportCost}
              selectedServiceTitle={selectedService.title}
              selectedDuration={selectedDuration}
            />
          )}

          {/* STEP 6: Confirmation & Success Screen */}
          {step === 6 && completedBooking && (
            <div className="space-y-6 text-center py-4">
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Booking Terkonfirmasi
                </span>
                <h3 className="text-2xl font-bold font-serif-display text-stone-900">
                  Terapis Sedang Dipersiapkan!
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Pesanan Anda telah masuk ke sistem kami. Mitra terapis <strong>{completedBooking.therapistName}</strong> telah menerima notifikasi penugasan ke alamat Anda.
                </p>
              </div>

              {/* Booking Code Card */}
              <div className="bg-white rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 border border-stone-100 shadow-soft shadow-soft-hover">
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <span className="text-xs text-stone-500">Kode Booking Resmi:</span>
                  <span className="text-base font-extrabold text-emerald-400 tracking-wider">
                    #{completedBooking.bookingCode}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-stone-500">
                  <div>💆 <strong>Layanan:</strong> {completedBooking.serviceTitle} ({completedBooking.durationMinutes} Min)</div>
                  <div>📅 <strong>Jadwal:</strong> {completedBooking.bookingDate} • {completedBooking.bookingTimeSlot} WIB</div>
                  <div>📍 <strong>Alamat:</strong> {completedBooking.address}, {completedBooking.kecamatan}</div>
                  <div>💰 <strong>Total:</strong> {formatRupiah(completedBooking.totalAmount)} ({(completedBooking.paymentMethod || 'transfer').toUpperCase()})</div>
                </div>

                {completedBooking.paymentUrl && (
                  <div className="pt-2">
                    <a
                      href={completedBooking.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>BAYAR SEKARANG via Xendit</span>
                    </a>
                    <p className="text-[10px] text-center text-stone-400 mt-2 italic">
                      Klik tombol di atas untuk menyelesaikan pembayaran aman via GoPay, OVO, Dana, atau Virtual Account.
                    </p>
                  </div>
                )}

                {completedBooking.paymentMethod === 'qris' && !completedBooking.paymentUrl && (
                  <div className="p-3 bg-white text-stone-900 rounded-xl text-center space-y-2 mt-2">
                    <div className="text-xs font-bold">QRIS Dynamic Pembayaran</div>
                    <div className="w-32 h-32 bg-stone-100 border-2 border-dashed border-stone-300 mx-auto flex items-center justify-center text-stone-500 rounded-lg">
                      <QrCode className="w-20 h-20 text-stone-800" />
                    </div>
                    <div className="text-[10px] text-stone-500">Scan menggunakan aplikasi GoPay, OVO, DANA, atau BCA Mobile</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                
                {/* Google Calendar */}
                <a
                  href={generateGoogleCalendarUrl(completedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Tambah ke Google Calendar</span>
                </a>

                {/* WhatsApp Share */}
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppBookingMessage(completedBooking)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Rincian ke WhatsApp CS</span>
                </a>

                {/* Copy Booking Details */}
                <button
                  type="button"
                  onClick={() => handleCopyDetails(completedBooking)}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Tersalin!' : 'Salin Rincian'}</span>
                </button>

                {/* Track Order */}
                <button
                  onClick={() => {
                    setActiveBooking(completedBooking);
                    setActiveCustomerTab('riwayat');
                    handleClose();
                  }}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Lacak Kedatangan Terapis</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>

            </div>
          )}
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Wizard Footer Navigation (Steps 1 to 5) */}
        {step < 6 && (
          <div className="p-5 bg-stone-50 border-t border-stone-100 rounded-b-3xl flex items-center justify-between gap-4">
            
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 border border-stone-100 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <div className="text-xs text-stone-500">
                Layanan: <strong>{selectedService.title}</strong>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-stone-500 uppercase font-semibold">Estimasi Total</div>
                <div className="text-sm font-bold text-stone-900">{formatRupiah(grandTotal)}</div>
              </div>

              {step < 5 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <span>Lanjut</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  disabled={!hasAgreedToTerms || isSubmitting}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                    hasAgreedToTerms && !isSubmitting
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-950/10 active:scale-95 cursor-pointer' 
                      : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Memproses...' : 'Konfirmasi & Booking Sekarang'}</span>
                </button>
              )}
            </div>

          </div>
        )}

        <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      </motion.div>
    </motion.div>
  );
};
