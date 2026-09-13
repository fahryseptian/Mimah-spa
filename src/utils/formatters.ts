import { 
  TransportTariffConfig, 
  TransportBreakdown, 
  PlaceType, 
  BookingItem,
  BookingStatus 
} from '../types';

export const DEFAULT_TARIFF: TransportTariffConfig = {
  baseFare: 10000,
  freeRadiusKm: 3,
  perKmFare: 2500,
  nightSurcharge: 15000,
  weatherSurcharge: 10000,
  apartmentSurcharge: 5000,
};

export const formatRupiah = (amount: number): string => {
  const safeAmount = (isNaN(amount) || amount == null) ? 0 : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeAmount);
};

export const calculateTransportFare = (
  distanceKm: number,
  timeSlot: string,
  isRainy: boolean,
  placeType: PlaceType,
  tariff: TransportTariffConfig = DEFAULT_TARIFF
): TransportBreakdown => {
  const safeDistanceKm = (isNaN(distanceKm) || distanceKm == null) ? 2.5 : distanceKm;
  // Check if night time (21:00 or later, or before 06:00)
  const hourMatch = timeSlot ? timeSlot.match(/^(\d{2})/) : null;
  const hour = hourMatch ? parseInt(hourMatch[1], 10) : 12;
  const isNight = hour >= 21 || hour < 6;

  let base = tariff?.baseFare ?? 10000;
  let distanceFare = 0;
  let freePromoDiscount = 0;

  const freeRadius = tariff?.freeRadiusKm ?? 3;
  if (safeDistanceKm <= freeRadius) {
    // Within free radius promo!
    freePromoDiscount = base;
  } else {
    const extraKm = safeDistanceKm - freeRadius;
    distanceFare = Math.round(extraKm * (tariff?.perKmFare ?? 2500));
  }

  const nightSurcharge = isNight ? (tariff?.nightSurcharge ?? 15000) : 0;
  const weatherSurcharge = isRainy ? (tariff?.weatherSurcharge ?? 10000) : 0;
  const placeTypeSurcharge = (placeType === 'apartemen' || placeType === 'hotel' || placeType === 'kantor') 
    ? (tariff?.apartmentSurcharge ?? 5000) 
    : 0;

  const totalTransport = Math.max(
    0, 
    base - freePromoDiscount + distanceFare + nightSurcharge + weatherSurcharge + placeTypeSurcharge
  );

  return {
    base,
    distanceKm: safeDistanceKm,
    distanceFare,
    nightSurcharge,
    weatherSurcharge,
    placeTypeSurcharge,
    freePromoDiscount,
    totalTransport,
  };
};

export const generateBookingCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `MSPA-${dateStr}-${randomStr}`;
};

export const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) || lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return 2.5;
  }
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const safeA = Math.min(1, Math.max(0, a));
  const c = 2 * Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA));
  const d = R * c; // Distance in km
  const result = Math.max(1.2, Math.round(d * 10) / 10);
  return isNaN(result) ? 2.5 : result;
};

export const findNearestAvailableTherapist = (therapists: any[], targetLat: number = 3.5952, targetLng: number = 98.6722): any | null => {
  const onlineTherapists = therapists.filter(t => t.status === 'online');
  if (onlineTherapists.length === 0) return therapists[0] || null;

  let nearest = onlineTherapists[0];
  let minDistance = calculateDistanceKm(targetLat, targetLng, nearest.lat || 3.5952, nearest.lng || 98.6722);

  for (let i = 1; i < onlineTherapists.length; i++) {
    const t = onlineTherapists[i];
    const dist = calculateDistanceKm(targetLat, targetLng, t.lat || 3.5952, t.lng || 98.6722);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = t;
    }
  }
  return nearest;
};

export const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case 'pending':
      return { label: 'Menunggu Konfirmasi', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'confirmed':
      return { label: 'Pesanan Dikonfirmasi', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    case 'therapist_on_the_way':
      return { label: 'Terapis Menuju Lokasi', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    case 'therapist_arrived':
      return { label: 'Terapis Telah Tiba', color: 'bg-teal-100 text-teal-800 border-teal-300' };
    case 'in_session':
      return { label: 'Sesi Terapi Berlangsung', color: 'bg-purple-100 text-purple-800 border-purple-300' };
    case 'completed':
      return { label: 'Layanan Selesai', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'cancelled':
      return { label: 'Dibatalkan', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    default:
      return { label: status, color: 'bg-stone-100 text-stone-800 border-stone-300' };
  }
};

export const generateWhatsAppBookingMessage = (booking: BookingItem): string => {
  const addOnsText = booking.selectedAddOns.length > 0 
    ? booking.selectedAddOns.map(a => `+ ${a.name} (${formatRupiah(a.price)})`).join('\n   ')
    : 'Tidak ada';

  const therapistPref = booking.therapistName 
    ? `💆 Terapis: ${booking.therapistName}`
    : `💆 Preferensi Terapis: Wanita (Standard Mimah Spa)`;

  const message = `*KONFIRMASI BOOKING HOME SERVICE - MIMAH SPA*
----------------------------------------
📌 *Kode Booking*: #${booking.bookingCode}
📅 *Jadwal*: ${booking.bookingDate} | ⏰ ${booking.bookingTimeSlot} WIB
💆 *Layanan*: ${booking.serviceTitle} (${booking.durationMinutes} Menit)
✨ *Add-on*: 
   ${addOnsText}
${therapistPref}
🌿 *Pilihan Minyak*: ${booking.selectedOil || 'Standard'}
💪 *Kekuatan Tekanan*: ${(booking.pressureLevel || 'sedang').toUpperCase()}

👤 *DATA PELANGGAN*
- Nama: ${booking.customerName}
- No. HP: ${booking.customerPhone}
- Tipe Lokasi: ${(booking.placeType || 'rumah').toUpperCase()}
- Alamat: ${booking.address}, ${booking.kecamatan}, ${booking.city}
${booking.addressNotes ? `- Patokan: ${booking.addressNotes}` : ''}

💰 *RINCIAN BIAYA*
- Biaya Layanan: ${formatRupiah(booking.servicePrice)}
- Ongkos Transport (${booking.estimatedDistanceKm || 1.2} km): ${formatRupiah(booking.transportCost || 0)}
${booking.voucherDiscount > 0 ? `- Diskon Promo (${booking.voucherCode}): -${formatRupiah(booking.voucherDiscount)}` : ''}
*TOTAL PEMBAYARAN: ${formatRupiah(booking.totalAmount)}*
💳 Metode Bayar: ${(booking.paymentMethod || 'transfer').toUpperCase()} (${booking.paymentStatus === 'paid' ? 'SUDAH LUNAS' : 'MENUNGGU KONFIRMASI'})

Mohon diproses penugasan terapis resmi Mimah Spa. Terima kasih! 🙏`;

  return encodeURIComponent(message);
};

export const getOilOptions = () => [
  { id: 'vco', name: 'Minyak Kelapa Murni (Virgin Coconut Oil)', desc: 'Lembut alami, melembabkan & menutrisi kulit' },
  { id: 'zaitun_lavender', name: 'Minyak Zaitun + Aroma Lavender', desc: 'Menenangkan pikiran, atasi stres & insomnia' },
  { id: 'kayu_putih_hangat', name: 'Minyak Aromaterapi Kayu Putih & Eucalyptus', desc: 'Hangat meresap, ampuh atasi masuk angin & pegal' },
  { id: 'sereh_jahe', name: 'Minyak Herbal Sereh & Jahe Tradisional', desc: 'Melancarkan peredaran darah & detoks alami' },
  { id: 'baby_oil', name: 'Minyak Khusus Hypoallergenic (Mom & Baby)', desc: 'Aman untuk kulit sensitif dan ibu hamil' },
];

export const getPressureOptions = () => [
  { id: 'ringan', name: 'Ringan & Santai (Soft)', desc: 'Cocok untuk relaksasi ringan, ibu hamil, atau lansia' },
  { id: 'sedang', name: 'Sedang (Medium)', desc: 'Tekanan standar seimbang untuk kebugaran tubuh' },
  { id: 'kuat', name: 'Kuat & Dalam (Firm / Hard)', desc: 'Fokus merelaksasi simpul otot kaku & pegal berat' },
];

export const generateGoogleCalendarUrl = (booking: BookingItem): string => {
  try {
    const [year, month, day] = booking.bookingDate.split('-').map(Number);
    const [hour, minute] = booking.bookingTimeSlot.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hour || 9, minute || 0);
    const endDate = new Date(startDate.getTime() + (booking.durationMinutes || 90) * 60000);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const title = encodeURIComponent(`Spa Panggilan Mimah Spa: ${booking.serviceTitle}`);
    const details = encodeURIComponent(`Jadwal Sesi Spa Panggilan ke rumah oleh ${booking.customerName}.\nLayanan: ${booking.serviceTitle} (${booking.durationMinutes} Menit).\nKode Booking: #${booking.bookingCode}\nTotal: ${formatRupiah(booking.totalAmount)}`);
    const location = encodeURIComponent(`${booking.address}, ${booking.kecamatan || ''}, Medan`);
    const dates = `${formatDate(startDate)}/${formatDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  } catch {
    return 'https://calendar.google.com';
  }
};

