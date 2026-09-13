export type TherapistGender = 'male' | 'female';
export type TherapistGenderPreference = 'male' | 'female' | 'any';
export type TherapistStatus = 'online' | 'busy' | 'offline';

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  verified: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  gender: TherapistGender;
  age: number;
  photoUrl: string;
  phone: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  totalHours: number;
  completedOrders: number;
  specialties: string[];
  certifications: Certification[];
  baseCity: string;
  baseKecamatan: string;
  operationalCities: string[];
  status: TherapistStatus;
  commissionRate: number; // e.g. 0.75 for 75%
  bio: string;
  vaccinated: boolean;
  isTopTherapist: boolean;
  equipmentProvided: string[];
  assignedInventory: TherapistInventoryItem[];
  joinedDate: string;
  email?: string;
  dailyEarnings?: number;
  monthlyEarnings?: number;
  schedule?: Record<string, string[]>; // e.g. { 'Senin': ['09:00', '10:00', ...], 'Selasa': [] (off) }
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'alat' | 'bahan' | 'seragam';
  unit: string; // e.g. 'pcs', 'liter', 'botol'
  minStock: number;
}

export interface TherapistInventoryItem {
  itemId: string;
  name: string;
  quantity: number;
  lastStockUpDate: string;
  condition: 'good' | 'worn' | 'broken';
}

export type ServiceCategory = 
  | 'pijat_tradisional' 
  | 'refleksi' 
  | 'deep_tissue' 
  | 'mom_baby' 
  | 'bekam_kerokan' 
  | 'fisioterapi' 
  | 'totok_lulur' 
  | 'paket_hemat'
  | 'mimah_signature';

export interface ServiceDurationOption {
  durationMinutes: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
}

export interface ServiceAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  iconName: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  category: ServiceCategory;
  description: string;
  benefits: string[];
  suitableFor: string[];
  includes: string[];
  iconName: string;
  image: string;
  durationOptions: ServiceDurationOption[];
  availableAddOns: string[];
  allowedGenders: TherapistGender[];
  requiresSpecialCert?: boolean;
}

export interface TransportTariffConfig {
  baseFare: number;
  freeRadiusKm: number;
  perKmFare: number;
  nightSurcharge: number;
  weatherSurcharge: number;
  apartmentSurcharge: number;
}

export interface LocationZone {
  city: string;
  province: string;
  kecamatans: string[];
  baseTransportFee: number;
  isActive: boolean;
}

export type PlaceType = 'rumah' | 'apartemen' | 'hotel' | 'kos' | 'kantor';

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'therapist_on_the_way' 
  | 'therapist_arrived' 
  | 'in_session' 
  | 'completed' 
  | 'cancelled';

export type PaymentMethod = 
  | 'qris' 
  | 'bca_va' 
  | 'mandiri_va' 
  | 'bri_va' 
  | 'gopay' 
  | 'ovo' 
  | 'dana' 
  | 'shopeepay' 
  | 'whatsapp';

export type PaymentStatus = 'unpaid' | 'paid';

export interface TransportBreakdown {
  base: number;
  distanceKm: number;
  distanceFare: number;
  nightSurcharge: number;
  weatherSurcharge: number;
  placeTypeSurcharge: number;
  freePromoDiscount: number;
  totalTransport: number;
}

export interface BookingStatusLog {
  timestamp: string;
  status: BookingStatus;
  note: string;
}

export interface BookingItem {
  id: string;
  bookingCode: string;
  createdAt: string;
  serviceId: string;
  serviceTitle: string;
  durationMinutes: number;
  servicePrice: number;
  selectedAddOns: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
  therapistId?: string;
  therapistName?: string;
  therapistGenderPreference: TherapistGenderPreference;
  therapistPhoto?: string;
  therapistPhone?: string;
  customerName: string;
  customerPhone: string;
  customerGender: TherapistGender;
  customerEmail?: string;
  bookingDate: string;
  bookingTimeSlot: string;
  city: string;
  kecamatan: string;
  address: string;
  addressNotes?: string;
  placeType: PlaceType;
  estimatedDistanceKm: number;
  transportCost: number;
  transportBreakdown: TransportBreakdown;
  voucherCode?: string;
  voucherDiscount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  statusLogs: BookingStatusLog[];
  customerLat?: number;
  customerLng?: number;
  therapistLat?: number;
  therapistLng?: number;
  paymentUrl?: string;
  specialNotes?: string;
  selectedOil: string;
  pressureLevel: 'ringan' | 'sedang' | 'kuat';
  focusAreas: string[];
  rating?: number;
  reviewText?: string;
}

export interface Voucher {
  code: string;
  title: string;
  discountPercent?: number;
  discountAmount?: number;
  isFreeShipping?: boolean;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  expiry: string;
  isActive?: boolean;
  quota?: number;
  usageCount?: number;
}

export interface TherapistReview {
  id: string;
  therapistId: string;
  customerName: string;
  customerCity: string;
  rating: number;
  serviceTitle: string;
  comment: string;
  date: string;
  verified: boolean;
}

export type UserRole = 'customer' | 'therapist' | 'admin';

export interface StockRequest {
  id: string;
  therapistId: string;
  therapistName: string;
  itemId: string;
  itemName: string;
  quantity: number;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SubscriptionPackage {
  id: string;
  title: string;
  price: number;
  sessionCount: number;
  validityDays: number;
  benefits: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  packageId: string;
  packageTitle: string;
  remainingSessions: number;
  expiryDate: string;
  totalSaved: number;
}

export interface ReferralHistoryItem {
  id: string;
  friendName: string;
  date: string;
  rewardPoints: number;
  status: 'completed' | 'pending';
}

export interface ClientCareNote {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  therapistId: string;
  therapistName: string;
  pressurePreference: 'ringan' | 'sedang' | 'kuat';
  oilPreference: string;
  focusAreas: string[];
  contraindications: string;
  therapistNotes: string;
  updatedAt: string;
}

export interface RefundDispute {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  totalAmount: number;
  refundPercent: number;
  refundAmount: number;
  reason: string;
  bankInfo: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: string;
}

export interface TherapistSOSAlert {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistPhone: string;
  locationAddress: string;
  lat: number;
  lng: number;
  timestamp: string;
  status: 'active' | 'resolved';
}

export interface TherapistApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  gender: TherapistGender;
  age: number;
  city: string;
  kecamatan: string;
  experienceYears: number;
  specialties: string[];
  certifications: string;
  motivation: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface CashoutRequest {
  id: string;
  therapistId: string;
  therapistName: string;
  amount: number;
  paymentMethod: string;
  accountNo: string;
  accountName: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender?: TherapistGender;
  loyaltyPoints: number;
  totalTransactions: number;
  totalSpent: number;
  joinedDate: string;
  lastVisit?: string;
  isVip?: boolean;
}

export interface GlobalSettings {
  adminWhatsapp: string;
  sosEmergencyPhone: string;
  operatingHoursStart: string;
  operatingHoursEnd: string;
  defaultCommissionRate: number;
  loyaltyPointsPerReview: number;
  referralRewardPoints: number;
  minPointsToRedeem: number;
  pointsToRupiahRate: number;
}

