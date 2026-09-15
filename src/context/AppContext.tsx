import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { Toaster, toast } from 'sonner';
import { 
  Therapist, 
  TherapistStatus,
  ServiceItem, 
  ServiceAddOn, 
  LocationZone, 
  Voucher, 
  TherapistReview, 
  BookingItem, 
  BookingStatus, 
  TransportTariffConfig, 
  UserRole,
  InventoryItem,
  TherapistInventoryItem,
  StockRequest,
  SubscriptionPackage,
  UserSubscription,
  ReferralHistoryItem,
  ClientCareNote,
  RefundDispute,
  TherapistSOSAlert,
  TherapistApplication,
  CashoutRequest,
  CustomerProfile,
  GlobalSettings
} from '../types';
import { 
  INITIAL_THERAPISTS, 
  INITIAL_SERVICES, 
  INITIAL_ADDONS, 
  INITIAL_CITIES, 
  INITIAL_VOUCHERS, 
  INITIAL_REVIEWS,
  INITIAL_INVENTORY_ITEMS
} from '../data/mockData';
import { DEFAULT_TARIFF, generateBookingCode } from '../utils/formatters';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  user: any;
  loading: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedKecamatan: string;
  setSelectedKecamatan: (kec: string) => void;
  therapists: Therapist[];
  addOns: ServiceAddOn[];
  cities: LocationZone[];
  vouchers: Voucher[];
  addVoucher: (voucher: Voucher) => void;
  updateVoucher: (code: string, updates: Partial<Voucher>) => void;
  deleteVoucher: (code: string) => void;
  services: ServiceItem[];
  addService: (service: ServiceItem) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  reviews: TherapistReview[];
  tariffConfig: TransportTariffConfig;
  updateTariffConfig: (config: TransportTariffConfig) => void;
  bookings: BookingItem[];
  activeBooking: BookingItem | null;
  setActiveBooking: (b: BookingItem | null) => void;
  createBooking: (data: any) => BookingItem;
  updateBookingStatus: (bookingId: string, status: BookingStatus, note?: string) => void;
  addTherapist: (data: any) => Therapist;
  updateTherapist: (id: string, updates: Partial<Therapist>) => void;
  deleteTherapist: (id: string) => void;
  toggleTherapistStatus: (id: string) => void;
  selectedTherapistForBooking: Therapist | null;
  setSelectedTherapistForBooking: (t: Therapist | null) => void;
  selectedServiceForBooking: ServiceItem | null;
  setSelectedServiceForBooking: (s: ServiceItem | null) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  viewingTherapist: Therapist | null;
  setViewingTherapist: (t: Therapist | null) => void;
  submitReview: (therapistId: string, bookingId: string, rating: number, comment: string, customerName: string) => void;
  currentTherapistId: string;
  setCurrentTherapistId: (id: string) => void;
  activeCustomerTab: string;
  setActiveCustomerTab: (tab: string) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  userPoints: number;
  addPoints: (amount: number) => void;
  deductPoints: (amount: number) => void;
  isLoyaltyModalOpen: boolean;
  setIsLoyaltyModalOpen: (open: boolean) => void;
  notificationToast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  updateTherapistInventory: (therapistId: string, itemId: string, quantity: number, condition: any) => void;
  whatsappNumber: string;
  updateWhatsappNumber: (num: string) => void;
  stockRequests: StockRequest[];
  createStockRequest: (therapistId: string, itemId: string, quantity: number) => void;
  approveStockRequest: (requestId: string) => void;
  rejectStockRequest: (requestId: string) => void;
  whatsappLogs: { id: string; timestamp: string; recipient: string; message: string; type: string }[];
  clearWhatsappLogs: () => void;
  addWhatsappLog: (recipient: string, message: string, type: string) => void;
  // Fitur 1: Membership & Referral
  activeSubscription: UserSubscription | null;
  buySubscription: (pkg: SubscriptionPackage) => void;
  referralCode: string;
  referralHistory: ReferralHistoryItem[];
  claimReferral: (friendName: string) => void;
  // Fitur 2: Therapist SOS & Client Care
  sosAlerts: TherapistSOSAlert[];
  triggerSOSAlert: (therapistId: string, address: string) => void;
  resolveSOSAlert: (alertId: string) => void;
  clientCareNotes: ClientCareNote[];
  saveClientCareNote: (note: ClientCareNote) => void;
  // Fitur 3: Admin Refunds & Dispute Resolution
  refundDisputes: RefundDispute[];
  submitRefundDispute: (data: Omit<RefundDispute, 'id' | 'createdAt' | 'status'>) => void;
  approveRefundDispute: (disputeId: string, adminNote?: string) => void;
  rejectRefundDispute: (disputeId: string, adminNote?: string) => void;
  // Fitur 4: Pendaftaran Mitra Terapis Baru
  therapistApplications: TherapistApplication[];
  submitTherapistApplication: (data: Omit<TherapistApplication, 'id' | 'status' | 'createdAt'>) => void;
  updateTherapistApplicationStatus: (id: string, status: TherapistApplication['status']) => void;
  // Fitur Tambahan: Upsell & Cashout
  addAddonToBooking: (bookingId: string, addonId: string) => void;
  requestCashout: (therapistId: string, amount: number, paymentMethod: string, accountNo: string, accountName: string) => void;
  cashoutRequests: CashoutRequest[];
  updateCashoutRequestStatus: (id: string, status: 'completed' | 'rejected') => void;
  updateTherapistSchedule: (therapistId: string, schedule: Record<string, string[]>) => void;
  // Fitur 5: Admin CRM & Settings
  customerProfiles: CustomerProfile[];
  globalSettings: GlobalSettings;
  updateGlobalSettings: (settings: GlobalSettings) => void;
  awardPointsToCustomer: (phone: string, points: number) => void;
  logout: () => void;
  isDbConnected: boolean;
  lastStatusUpdate: { bookingId: string; bookingCode: string; status: BookingStatus } | null;
  clearLastStatusUpdate: () => void;
  assignTherapist: (bookingId: string, therapist: Therapist) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(() => isSupabaseConfigured());
  const [lastStatusUpdate, setLastStatusUpdate] = useState<{ bookingId: string; bookingCode: string; status: BookingStatus } | null>(null);
  
  const clearLastStatusUpdate = () => setLastStatusUpdate(null);

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('nsc_user_role');
    if (savedRole === 'admin' || savedRole === 'therapist' || savedRole === 'customer') {
      return savedRole as UserRole;
    }
    return 'customer';
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('nsc_user_role', role);
  };

  const [selectedCity, setSelectedCity] = useState<string>('Kota Medan');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('Medan Baru');
  const [activeCustomerTab, setActiveCustomerTab] = useState<string>('katalog');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('analytics');

  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem('mimah_points');
    return saved ? parseInt(saved) : 5000; // Welcome points
  });

  const addPoints = (amount: number) => {
    setUserPoints(prev => {
      const newVal = prev + amount;
      localStorage.setItem('mimah_points', newVal.toString());
      return newVal;
    });
    
    // Celebratory confetti for points
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff'],
    });
  };

  const deductPoints = (amount: number) => {
    setUserPoints(prev => {
      const newVal = Math.max(0, prev - amount);
      localStorage.setItem('mimah_points', newVal.toString());
      return newVal;
    });
  };

  useEffect(() => {
    if (supabase) {
      setIsDbConnected(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user?.user_metadata?.role) {
          const mRole = session.user.user_metadata.role;
          if (mRole === 'admin' || mRole === 'therapist' || mRole === 'customer') {
            setUserRole(mRole);
          }
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user?.user_metadata?.role) {
          const mRole = session.user.user_metadata.role;
          if (mRole === 'admin' || mRole === 'therapist' || mRole === 'customer') {
            setUserRole(mRole);
          }
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setIsDbConnected(false);
      setLoading(false);
    }
  }, []);

  // Persisted or default states with migration for Medan
  const [therapists, setTherapists] = useState<Therapist[]>(INITIAL_THERAPISTS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [addOns] = useState<ServiceAddOn[]>(INITIAL_ADDONS);
  const [cities] = useState<LocationZone[]>(INITIAL_CITIES);
  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('nsc_vouchers_v1');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });
  const [reviews, setReviews] = useState<TherapistReview[]>(INITIAL_REVIEWS);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [tariffConfig, setTariffConfig] = useState<TransportTariffConfig>(() => {
    const saved = localStorage.getItem('nsc_tariff_medan_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.freeRadiusKm = 0;
        return parsed;
      } catch (e) {}
    }
    return DEFAULT_TARIFF;
  });

  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    const saved = localStorage.getItem('mimah_whatsapp_cs_v1');
    return saved ? saved : '6285361991731';
  });

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('mimah_global_settings_v1');
    return saved ? JSON.parse(saved) : {
      adminWhatsapp: '6285361991731',
      sosEmergencyPhone: '628123456789',
      operatingHoursStart: '08:00',
      operatingHoursEnd: '22:00',
      defaultCommissionRate: 0.75,
      loyaltyPointsPerReview: 1000,
      referralRewardPoints: 5000,
      minPointsToRedeem: 10000,
      pointsToRupiahRate: 1,
    };
  });

  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem('mimah_customer_profiles_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const updateWhatsappNumber = (num: string) => {
    let clean = num.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    setWhatsappNumber(clean);
    localStorage.setItem('mimah_whatsapp_cs_v1', clean);
  };

  // Production-Ready: Parallelized Fast Fetch from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;

      try {
        const [
          therapistsRes,
          servicesRes,
          bookingsRes,
          reviewsRes,
          vouchersRes,
          settingsRes
        ] = await Promise.allSettled([
          supabase.from('therapists').select('*').order('name'),
          supabase.from('services').select('*').order('title'),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }),
          supabase.from('reviews').select('*').order('created_at', { ascending: false }),
          supabase.from('vouchers').select('*'),
          supabase.from('settings').select('*').eq('key', 'tariff_config').maybeSingle()
        ]);

        // Process Therapists
        if (therapistsRes.status === 'fulfilled' && therapistsRes.value.data && therapistsRes.value.data.length > 0) {
          const mappedTherapists = therapistsRes.value.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            phone: t.phone || '',
            photoUrl: t.photo_url || t.photo || t.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            gender: t.gender || 'female',
            rating: Number(t.rating) || 5.0,
            reviewCount: t.review_count || t.reviewCount || 0,
            status: t.status || (t.is_available !== false ? 'online' : 'offline'),
            isAvailable: t.is_available ?? t.isAvailable ?? true,
            baseCity: t.city || t.baseCity || 'Medan',
            specialties: Array.isArray(t.specialties) ? t.specialties : (Array.isArray(t.skills) ? t.skills : []),
            certifications: Array.isArray(t.certifications) ? t.certifications : [],
            bio: t.bio || '',
            joinedDate: t.joined_date || t.joinedDate || '2023-01-01',
            commissionRate: t.commission_rate || t.commissionRate || 0.7,
            isTopTherapist: t.is_top_therapist ?? t.isTopTherapist ?? false,
            completedOrders: t.completed_sessions || t.completedOrders || 0,
            totalHours: t.totalHours || 0,
            dailyEarnings: t.dailyEarnings || 0,
            monthlyEarnings: t.monthlyEarnings || 0,
            assignedInventory: t.assignedInventory || []
          }));
          setTherapists(mappedTherapists);
        }

        // Process Services
        if (servicesRes.status === 'fulfilled' && servicesRes.value.data && servicesRes.value.data.length > 0) {
          const mappedServices = servicesRes.value.data.map((s: any) => {
            let durationOpts = s.durationOptions || s.duration_options || [];
            if (typeof durationOpts === 'string') {
              try { durationOpts = JSON.parse(durationOpts); } catch (e) { durationOpts = []; }
            }
            if (!Array.isArray(durationOpts) || durationOpts.length === 0) {
              durationOpts = [
                { durationMinutes: s.duration_minutes || 90, price: s.price || 135000, popular: true }
              ];
            }

            let benefitsList = s.benefits || [];
            if (typeof benefitsList === 'string') {
              try { benefitsList = JSON.parse(benefitsList); } catch (e) { benefitsList = []; }
            }

            let suitableList = s.suitableFor || s.suitable_for || [];
            if (typeof suitableList === 'string') {
              try { suitableList = JSON.parse(suitableList); } catch (e) { suitableList = []; }
            }

            let includesList = s.includes || [];
            if (typeof includesList === 'string') {
              try { includesList = JSON.parse(includesList); } catch (e) { includesList = []; }
            }

            let addOnsList = s.availableAddOns || s.available_add_ons || [];
            if (typeof addOnsList === 'string') {
              try { addOnsList = JSON.parse(addOnsList); } catch (e) { addOnsList = []; }
            }

            let gendersList = s.allowedGenders || s.allowed_genders || ['female'];
            if (typeof gendersList === 'string') {
              try { gendersList = JSON.parse(gendersList); } catch (e) { gendersList = ['female']; }
            }

            return {
              id: s.id,
              title: s.title || 'Layanan Spa',
              tagline: s.tagline || '',
              category: s.category || 'pijat_tradisional',
              description: s.description || '',
              benefits: Array.isArray(benefitsList) ? benefitsList : [],
              suitableFor: Array.isArray(suitableList) ? suitableList : [],
              includes: Array.isArray(includesList) ? includesList : [],
              iconName: s.iconName || s.icon_name || 'Sparkles',
              image: s.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&auto=format&fit=crop&q=80',
              durationOptions: durationOpts,
              availableAddOns: Array.isArray(addOnsList) ? addOnsList : [],
              allowedGenders: Array.isArray(gendersList) ? gendersList : ['female'],
              isPopular: s.isPopular ?? s.is_popular ?? false
            };
          });
          setServices(mappedServices);
        }

        // Process Bookings
        if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data && bookingsRes.value.data.length > 0) {
          const mappedBookings = bookingsRes.value.data.map((b: any) => ({
            id: b.id,
            bookingCode: b.booking_code,
            createdAt: b.created_at,
            serviceId: b.service_id,
            serviceTitle: b.service_title,
            durationMinutes: b.duration_minutes,
            servicePrice: b.service_price,
            selectedAddOns: b.selected_add_ons,
            therapistId: b.therapist_id,
            therapistName: b.therapist_name,
            therapistPhoto: b.therapist_photo,
            therapistPhone: b.therapist_phone,
            customerName: b.customer_name,
            customerPhone: b.customer_phone,
            customerGender: b.customer_gender,
            customerEmail: b.customer_email,
            bookingDate: b.booking_date,
            bookingTimeSlot: b.booking_time_slot,
            city: b.city,
            kecamatan: b.kecamatan,
            address: b.address,
            addressNotes: b.address_notes,
            placeType: b.place_type,
            estimatedDistanceKm: b.estimated_distance_km,
            transportCost: b.transport_cost,
            transportBreakdown: b.transport_breakdown,
            voucherCode: b.voucher_code,
            voucherDiscount: b.voucher_discount,
            totalAmount: b.total_amount,
            paymentMethod: b.payment_method,
            paymentStatus: b.payment_status,
            status: b.status,
            statusLogs: b.status_logs,
            specialNotes: b.special_notes,
            selectedOil: b.selected_oil,
            pressureLevel: b.pressure_level,
            focusAreas: b.focus_areas
          }));
          setBookings(mappedBookings);
        }

        // Process Reviews
        if (reviewsRes.status === 'fulfilled' && reviewsRes.value.data && reviewsRes.value.data.length > 0) {
          setReviews(reviewsRes.value.data);
        }

        // Process Vouchers
        if (vouchersRes.status === 'fulfilled' && vouchersRes.value.data && vouchersRes.value.data.length > 0) {
          setVouchers(vouchersRes.value.data);
        }

        // Process Settings
        if (settingsRes.status === 'fulfilled' && settingsRes.value.data?.value) {
          setTariffConfig(settingsRes.value.data.value);
        }

      } catch (err) {
        console.error('Error fetching Supabase data in production mode:', err);
      }
    };

    fetchData();

    // Real-time listener for new bookings and status updates
    if (supabase) {
      const bookingChannel = supabase
        .channel('public:bookings')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
          if (userRole === 'admin') {
            toast.success(`Pesanan Baru Masuk! #${payload.new.booking_code} dari ${payload.new.customer_name}`, {
              duration: 8000,
              position: 'top-right',
              description: `Layanan: ${payload.new.service_title}`
            });
          }
          // Safely map Supabase column names to JS keys
          const newBooking: any = {
            id: payload.new.id,
            bookingCode: payload.new.booking_code,
            createdAt: payload.new.created_at,
            serviceId: payload.new.service_id,
            serviceTitle: payload.new.service_title,
            durationMinutes: payload.new.duration_minutes,
            servicePrice: payload.new.service_price,
            selectedAddOns: payload.new.selected_add_ons,
            therapistId: payload.new.therapist_id,
            therapistName: payload.new.therapist_name,
            therapistPhoto: payload.new.therapist_photo,
            therapistPhone: payload.new.therapist_phone,
            customerName: payload.new.customer_name,
            customerPhone: payload.new.customer_phone,
            customerGender: payload.new.customer_gender,
            customerEmail: payload.new.customer_email,
            bookingDate: payload.new.booking_date,
            bookingTimeSlot: payload.new.booking_time_slot,
            city: payload.new.city,
            kecamatan: payload.new.kecamatan,
            address: payload.new.address,
            addressNotes: payload.new.address_notes,
            placeType: payload.new.place_type,
            estimatedDistanceKm: payload.new.estimated_distance_km,
            transportCost: payload.new.transport_cost,
            transportBreakdown: payload.new.transport_breakdown,
            voucherCode: payload.new.voucher_code,
            voucherDiscount: payload.new.voucher_discount,
            totalAmount: payload.new.total_amount,
            paymentMethod: payload.new.payment_method,
            paymentStatus: payload.new.payment_status,
            status: payload.new.status,
            statusLogs: payload.new.status_logs,
            specialNotes: payload.new.special_notes,
            selectedOil: payload.new.selected_oil,
            pressureLevel: payload.new.pressure_level,
            focusAreas: payload.new.focus_areas
          };
          setBookings(prev => {
            if (prev.find(b => b.id === newBooking.id)) return prev;
            return [newBooking, ...prev];
          });
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings' }, (payload) => {
          setBookings(prev => prev.map(b => {
            if (b.id === payload.new.id) {
              return {
                ...b,
                status: payload.new.status,
                paymentStatus: payload.new.payment_status,
                statusLogs: payload.new.status_logs,
                totalAmount: payload.new.total_amount ?? b.totalAmount,
                therapistId: payload.new.therapist_id ?? b.therapistId,
                therapistName: payload.new.therapist_name ?? b.therapistName,
                therapistPhoto: payload.new.therapist_photo ?? b.therapistPhoto,
              };
            }
            return b;
          }));
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookings' }, (payload) => {
          setBookings(prev => prev.filter(b => b.id !== payload.old.id));
        })
        .subscribe();

      // Realtime listener for therapist status & data sync across admin and portal
      const therapistChannel = supabase
        .channel('public:therapists')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'therapists' }, (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setTherapists(prev => prev.map(t => {
              if (t.id === payload.new.id) {
                return {
                  ...t,
                  status: payload.new.status || t.status,
                  isAvailable: payload.new.is_available ?? (payload.new.status === 'online'),
                  name: payload.new.name || t.name,
                  phone: payload.new.phone || t.phone,
                  photoUrl: payload.new.photo_url || payload.new.photo || t.photoUrl,
                  commissionRate: payload.new.commission_rate ?? t.commissionRate
                };
              }
              return t;
            }));
          } else if (payload.eventType === 'INSERT' && payload.new) {
            const newT: Therapist = {
              id: payload.new.id,
              name: payload.new.name,
              phone: payload.new.phone || '',
              photoUrl: payload.new.photo_url || payload.new.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
              gender: payload.new.gender || 'female',
              age: payload.new.age || 28,
              experienceYears: payload.new.experience_years || 3,
              rating: Number(payload.new.rating) || 5.0,
              reviewCount: payload.new.review_count || 0,
              status: (payload.new.status as TherapistStatus) || 'online',
              baseCity: payload.new.city || 'Medan',
              baseKecamatan: payload.new.base_kecamatan || 'Medan Baru',
              operationalCities: ['Medan'],
              specialties: Array.isArray(payload.new.specialties) ? payload.new.specialties : ['Mimah Signature'],
              certifications: Array.isArray(payload.new.certifications) ? payload.new.certifications : [],
              bio: payload.new.bio || '',
              vaccinated: true,
              isTopTherapist: payload.new.is_top_therapist || false,
              equipmentProvided: ['Matras Portable', 'Essential Oils'],
              joinedDate: payload.new.joined_date || '2024-01-01',
              commissionRate: payload.new.commission_rate || 0.7,
              completedOrders: payload.new.completed_sessions || 0,
              totalHours: 0,
              dailyEarnings: 0,
              monthlyEarnings: 0,
              assignedInventory: []
            };
            setTherapists(prev => {
              if (prev.some(t => t.id === newT.id)) return prev;
              return [newT, ...prev];
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setTherapists(prev => prev.filter(t => t.id !== payload.old.id));
          }
        })
        .subscribe();

      // Realtime listener for services
      const servicesChannel = supabase
        .channel('public:services')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setServices(prev => prev.map(s => {
              if (s.id === payload.new.id) {
                return {
                  ...s,
                  title: payload.new.title || s.title,
                  category: payload.new.category || s.category,
                  description: payload.new.description || s.description,
                  image: payload.new.image_url || payload.new.image || s.image,
                  isPopular: payload.new.is_popular ?? s.isPopular
                };
              }
              return s;
            }));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setServices(prev => prev.filter(s => s.id !== payload.old.id));
          }
        })
        .subscribe();

      // Realtime listener for vouchers & discounts
      const vouchersChannel = supabase
        .channel('public:vouchers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vouchers' }, (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setVouchers(prev => {
              if (prev.some(v => v.code === payload.new.code)) return prev;
              return [payload.new as Voucher, ...prev];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setVouchers(prev => prev.map(v => v.code === payload.new.code ? (payload.new as Voucher) : v));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setVouchers(prev => prev.filter(v => v.code !== payload.old.code));
          }
        })
        .subscribe();

      // Realtime listener for customer reviews & ratings
      const reviewsChannel = supabase
        .channel('public:reviews')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, (payload) => {
          if (payload.new) {
            setReviews(prev => {
              if (prev.some(r => r.id === payload.new.id)) return prev;
              return [payload.new as TherapistReview, ...prev];
            });
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(bookingChannel);
        supabase.removeChannel(therapistChannel);
        supabase.removeChannel(servicesChannel);
        supabase.removeChannel(vouchersChannel);
        supabase.removeChannel(reviewsChannel);
      };
    }
  }, [userRole]);

  const [activeBooking, setActiveBooking] = useState<BookingItem | null>(null);
  
  // Real-time synchronization for active booking in view
  useEffect(() => {
    if (bookings.length > 0) {
      if (!activeBooking) {
        setActiveBooking(bookings[0]);
      } else {
        const synced = bookings.find(b => b.id === activeBooking.id);
        if (synced && (synced.status !== activeBooking.status || synced.paymentStatus !== activeBooking.paymentStatus || synced.therapistId !== activeBooking.therapistId)) {
          setActiveBooking(synced);
        }
      }
    }
  }, [bookings, activeBooking]);
  const [selectedTherapistForBooking, setSelectedTherapistForBooking] = useState<Therapist | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState<boolean>(false);
  const [viewingTherapist, setViewingTherapist] = useState<Therapist | null>(null);
  const [currentTherapistId, setCurrentTherapistId] = useState<string>('terapis-1');
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
    if (supabase) {
      supabase.from('master_inventory').insert({
        id: item.id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        min_stock: item.minStock
      }).then(({ error }) => {
        if (error) console.error('Supabase add inventory error:', error.message);
      });
    }
    showToast('Barang baru berhasil ditambahkan ke inventaris!', 'success');
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    if (supabase) {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.unit) dbUpdates.unit = updates.unit;
      if (updates.minStock !== undefined) dbUpdates.min_stock = updates.minStock;
      
      supabase.from('master_inventory').update(dbUpdates).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase update inventory error:', error.message);
      });
    }
    showToast('Data barang berhasil diperbarui!', 'success');
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    if (supabase) {
      supabase.from('master_inventory').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete inventory error:', error.message);
      });
    }
    showToast('Barang berhasil dihapus dari inventaris.', 'info');
  };

  const checkLowStock = (therapistId: string, itemId: string, quantity: number) => {
    const itemMaster = inventory.find(i => i.id === itemId);
    if (itemMaster && quantity <= itemMaster.minStock) {
      const therapist = therapists.find(t => t.id === therapistId);
      toast.warning(`Stok Rendah: ${itemMaster.name} milik ${therapist?.name} hanya tersisa ${quantity} ${itemMaster.unit}!`, {
        duration: 5000,
        position: 'top-right'
      });
    }
  };

  const updateTherapistInventory = (therapistId: string, itemId: string, quantity: number, condition: any) => {
    setTherapists(prev => prev.map(t => {
      if (t.id !== therapistId) return t;
      
      const existingItemIndex = t.assignedInventory?.findIndex(i => i.itemId === itemId) ?? -1;
      const newInventory = t.assignedInventory ? [...t.assignedInventory] : [];
      
      let updatedItem;
      if (existingItemIndex > -1) {
        updatedItem = {
          ...newInventory[existingItemIndex],
          quantity,
          condition,
          lastStockUpDate: new Date().toISOString().split('T')[0]
        };
        newInventory[existingItemIndex] = updatedItem;
      } else {
        const itemMaster = inventory.find(i => i.id === itemId);
        updatedItem = {
          itemId,
          name: itemMaster?.name || 'Unknown Item',
          quantity,
          condition,
          lastStockUpDate: new Date().toISOString().split('T')[0]
        };
        newInventory.push(updatedItem);
      }
      
      // Check for low stock alert
      checkLowStock(therapistId, itemId, quantity);

      // Sync to Supabase
      if (supabase) {
        supabase.from('therapist_inventory').upsert({
          therapist_id: therapistId,
          item_id: itemId,
          quantity,
          condition,
          last_stock_up_date: updatedItem.lastStockUpDate
        }).then(({ error }) => {
          if (error) {
            if (error.message?.includes('public.therapist_inventory') || error.message?.includes('Could not find the table')) {
              console.warn('Supabase info: "therapist_inventory" table not yet created in Supabase database. Falling back smoothly to LocalData state.');
            } else {
              console.error('Supabase inventory sync error:', error.message);
            }
          }
        });
      }
      
      return { ...t, assignedInventory: newInventory };
    }));
    showToast('Stok perlengkapan mitra berhasil diperbarui!', 'success');
  };

  // NEW: Stock Requests for inventory control
  const [stockRequests, setStockRequests] = useState<StockRequest[]>(() => {
    const saved = localStorage.getItem('mimah_stock_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'req-1',
        therapistId: 't-1',
        therapistName: 'Siti Rahmawati, S.Tr.Kes',
        itemId: 'inv-minyak-1',
        itemName: 'Minyak Signature Mimah',
        quantity: 5,
        requestedDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString().split('T')[0],
        status: 'pending'
      },
      {
        id: 'req-2',
        therapistId: 't-2',
        therapistName: 'Riana Safitri',
        itemId: 'inv-sprei-1',
        itemName: 'Sprei Disposable (Pack)',
        quantity: 10,
        requestedDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'pending'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mimah_stock_requests', JSON.stringify(stockRequests));
  }, [stockRequests]);

  const createStockRequest = (therapistId: string, itemId: string, quantity: number) => {
    const therapist = therapists.find(t => t.id === therapistId);
    const item = inventory.find(inv => inv.id === itemId);
    if (!therapist || !item) return;

    const newReq: StockRequest = {
      id: `req-${Date.now()}`,
      therapistId,
      therapistName: therapist.name,
      itemId,
      itemName: item.name,
      quantity,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setStockRequests(prev => [newReq, ...prev]);
    showToast('Permintaan penambahan stok berhasil dikirim ke Admin!', 'success');
  };

  const approveStockRequest = (requestId: string) => {
    const req = stockRequests.find(r => r.id === requestId);
    if (!req) return;

    // Update therapist inventory with requested quantity
    const therapist = therapists.find(t => t.id === req.therapistId);
    const currentQty = therapist?.assignedInventory?.find(i => i.itemId === req.itemId)?.quantity || 0;
    
    updateTherapistInventory(req.therapistId, req.itemId, currentQty + req.quantity, 'good');

    setStockRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
    showToast(`Permintaan stok disetujui. ${req.quantity} unit ditambahkan ke mitra!`, 'success');
  };

  const rejectStockRequest = (requestId: string) => {
    setStockRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
    showToast('Permintaan penambahan stok telah ditolak', 'info');
  };

  // NEW: Background automated WhatsApp simulated gateway
  const [whatsappLogs, setWhatsappLogs] = useState<{ id: string; timestamp: string; recipient: string; message: string; type: string }[]>(() => {
    const saved = localStorage.getItem('mimah_wa_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mimah_wa_logs', JSON.stringify(whatsappLogs));
  }, [whatsappLogs]);

  const clearWhatsappLogs = () => {
    setWhatsappLogs([]);
    localStorage.removeItem('mimah_wa_logs');
  };

  const addWhatsappLog = (recipient: string, message: string, type: string) => {
    const newLog = {
      id: `wa-log-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      recipient,
      message,
      type
    };
    setWhatsappLogs(prev => [newLog, ...prev]);
  };

  // --- FITUR 1: MEMBERSHIP & REFERRAL ---
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(() => {
    const saved = localStorage.getItem('mimah_active_sub_v1');
    return saved ? JSON.parse(saved) : {
      packageId: 'sub-bunda',
      packageTitle: 'Paket Bunda Sehat (4 Sesi)',
      remainingSessions: 3,
      expiryDate: new Date(Date.now() + 25 * 86400000).toLocaleDateString('id-ID'),
      totalSaved: 120000
    };
  });

  const buySubscription = (pkg: SubscriptionPackage) => {
    const expiry = new Date(Date.now() + pkg.validityDays * 86400000).toLocaleDateString('id-ID');
    const newSub: UserSubscription = {
      packageId: pkg.id,
      packageTitle: pkg.title,
      remainingSessions: pkg.sessionCount,
      expiryDate: expiry,
      totalSaved: Math.round(pkg.price * 0.25)
    };
    setActiveSubscription(newSub);
    localStorage.setItem('mimah_active_sub_v1', JSON.stringify(newSub));
    addPoints(2500);
    showToast(`Berhasil berlangganan ${pkg.title}! +2.500 Poin Tambahan`, 'success');
  };

  const [referralCode] = useState<string>('MIMAH-FAHRY88');
  const [referralHistory, setReferralHistory] = useState<ReferralHistoryItem[]>(() => {
    const saved = localStorage.getItem('mimah_ref_history_v1');
    return saved ? JSON.parse(saved) : [
      { id: 'ref-1', friendName: 'Anisa Putri', date: '05 Sep 2026', rewardPoints: 2500, status: 'completed' },
      { id: 'ref-2', friendName: 'Nia Kurnia', date: '01 Sep 2026', rewardPoints: 2500, status: 'completed' }
    ];
  });

  const claimReferral = (friendName: string) => {
    const newItem: ReferralHistoryItem = {
      id: `ref-${Date.now()}`,
      friendName,
      date: 'Baru saja',
      rewardPoints: 2500,
      status: 'completed'
    };
    setReferralHistory(prev => [newItem, ...prev]);
    localStorage.setItem('mimah_ref_history_v1', JSON.stringify([newItem, ...referralHistory]));
    addPoints(2500);
    showToast(`Referral sukses untuk ${friendName}! +2.500 Poin Cashback`, 'success');
  };

  // --- FITUR 2: THERAPIST SOS & CLIENT CARE ---
  const [sosAlerts, setSosAlerts] = useState<TherapistSOSAlert[]>(() => {
    const saved = localStorage.getItem('mimah_sos_alerts_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const triggerSOSAlert = (therapistId: string, address: string) => {
    const therapist = therapists.find(t => t.id === therapistId) || therapists[0];
    const newAlert: TherapistSOSAlert = {
      id: `sos-${Date.now()}`,
      therapistId: therapist.id,
      therapistName: therapist.name,
      therapistPhone: therapist.phone,
      locationAddress: address || 'Jl. Setia Budi Medan',
      lat: 3.565,
      lng: 98.652,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'active'
    };
    setSosAlerts(prev => [newAlert, ...prev]);
    localStorage.setItem('mimah_sos_alerts_v1', JSON.stringify([newAlert, ...sosAlerts]));
    
    // Add urgent WhatsApp alert log
    addWhatsappLog('0812-3456-7890', `⚠️ DARURAT SOS! Terapis ${therapist.name} memicu sinyal darurat di ${address}. Tim Keamanan Admin dikirim ke lokasi!`, 'SOS Peringatan');
    toast.error(`⚠️ SINYAL SOS DIKIRIM! Tim Keamanan Mimah Spa telah diberitahu lokasi Anda.`, { duration: 10000 });
  };

  const resolveSOSAlert = (alertId: string) => {
    setSosAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
    showToast('Status sinyal darurat SOS telah diselesaikan & ditangani', 'info');
  };

  const [clientCareNotes, setClientCareNotes] = useState<ClientCareNote[]>(() => {
    const saved = localStorage.getItem('mimah_care_notes_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const saveClientCareNote = (note: ClientCareNote) => {
    setClientCareNotes(prev => {
      const idx = prev.findIndex(n => n.bookingCode === note.bookingCode || n.customerPhone === note.customerPhone);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = note;
        return updated;
      }
      return [note, ...prev];
    });
    showToast('Rekam kondisi fisik & catatan terapi pelanggan berhasil disimpan!', 'success');
  };

  // --- FITUR 3: ADMIN REFUNDS & DISPUTE RESOLUTION ---
  const [refundDisputes, setRefundDisputes] = useState<RefundDispute[]>(() => {
    const saved = localStorage.getItem('mimah_refund_disputes_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const submitRefundDispute = (data: Omit<RefundDispute, 'id' | 'createdAt' | 'status'>) => {
    const newDispute: RefundDispute = {
      ...data,
      id: `disp-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('id-ID'),
      status: 'pending'
    };
    setRefundDisputes(prev => [newDispute, ...prev]);
    showToast(`Pengajuan refund untuk ${data.bookingCode} berhasil dikirim ke Admin!`, 'success');
  };

  const approveRefundDispute = (disputeId: string, adminNote?: string) => {
    setRefundDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status: 'approved', adminNote: adminNote || 'Disetujui. Transfer refund diproses ke rekening tujuan.' } : d));
    showToast('Refund telah DISETUJUI & status ditandai lunas refund!', 'success');
  };

  const rejectRefundDispute = (disputeId: string, adminNote?: string) => {
    setRefundDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status: 'rejected', adminNote: adminNote || 'Ditolak sesuai S&K pembatalan < 1 jam saat terapis tiba.' } : d));
    showToast('Sanggahan refund ditolak sesuai ketentuan S&K.', 'info');
  };

  // Sesi diselesaikan oleh terapis di portal terapis (ActiveSessionGuide) atau oleh admin


  // Ensure we don't aggressively override real data with localStorage fallback
  // Removed local storage sync for therapists and bookings for Strict Cloud Mode.
  
  useEffect(() => {
    localStorage.setItem('nsc_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('nsc_tariff', JSON.stringify(tariffConfig));
  }, [tariffConfig]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    // Switch to sonner for better UI
    if (type === 'success') toast.success(message);
    else if (type === 'warning') toast.error(message);
    else toast(message);

    setNotificationToast({ message, type });
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  const addService = (service: ServiceItem) => {
    setServices(prev => [service, ...prev]);
    showToast(`Layanan ${service.title} berhasil ditambahkan!`, 'success');
    if (supabase) {
      supabase.from('services').insert([service]).then(({ error }) => {
        if (error) console.error('Supabase service insert error:', error.message);
      });
    }
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Data layanan berhasil diperbarui!', 'success');
    if (supabase) {
      supabase.from('services').update(updates).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase service update error:', error.message);
      });
    }
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast('Layanan berhasil dihapus.', 'info');
    if (supabase) {
      supabase.from('services').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase service delete error:', error.message);
      });
    }
  };

  const updateTariffConfig = (newConfig: TransportTariffConfig) => {
    setTariffConfig(newConfig);
    showToast('Tarif estimasi transportasi berhasil diperbarui!', 'success');
    
    // Sync to Supabase
    if (supabase) {
      supabase.from('settings').upsert({
        key: 'tariff_config',
        value: newConfig,
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.error('Supabase settings sync error:', error.message);
      });
    }
  };

  const addVoucher = (voucher: Voucher) => {
    setVouchers(prev => {
      const updated = [...prev, voucher];
      localStorage.setItem('nsc_vouchers_v1', JSON.stringify(updated));
      return updated;
    });
    showToast('Voucher baru berhasil dibuat!', 'success');
    
    // Sync to Supabase
    if (supabase) {
      supabase.from('vouchers').insert([voucher]).then(({ error }) => {
        if (error) console.error('Supabase voucher insert error:', error.message);
      });
    }
  };

  const updateVoucher = (code: string, updates: Partial<Voucher>) => {
    setVouchers(prev => {
      const updated = prev.map(v => v.code === code ? { ...v, ...updates } : v);
      localStorage.setItem('nsc_vouchers_v1', JSON.stringify(updated));
      return updated;
    });
    showToast('Data voucher berhasil diperbarui!', 'success');
    
    // Sync to Supabase
    if (supabase) {
      supabase.from('vouchers').update(updates).eq('code', code).then(({ error }) => {
        if (error) console.error('Supabase voucher update error:', error.message);
      });
    }
  };

  const deleteVoucher = (code: string) => {
    setVouchers(prev => {
      const updated = prev.filter(v => v.code !== code);
      localStorage.setItem('nsc_vouchers_v1', JSON.stringify(updated));
      return updated;
    });
    showToast('Voucher berhasil dihapus!', 'info');
    
    // Sync to Supabase
    if (supabase) {
      supabase.from('vouchers').delete().eq('code', code).then(({ error }) => {
        if (error) console.error('Supabase voucher delete error:', error.message);
      });
    }
  };

  const createBooking = (data: any): BookingItem => {
    const bookingCode = generateBookingCode();
    const newBooking: BookingItem = {
      ...data,
      id: `booking-${Date.now()}`,
      bookingCode,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      statusLogs: [
        {
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: 'confirmed',
          note: 'Pesanan terkonfirmasi, terapis telah ditugaskan.',
        }
      ],
    };

    // Optimistic state update
    setBookings(prev => [newBooking, ...prev]);
    setActiveBooking(newBooking);
    showToast(`Booking berhasil dibuat! Kode: ${bookingCode}`, 'success');

    // Background Supabase Sync
    if (supabase) {
      supabase.from('bookings').insert([
        {
          id: newBooking.id,
          booking_code: newBooking.bookingCode,
          created_at: newBooking.createdAt,
          service_id: newBooking.serviceId,
          service_title: newBooking.serviceTitle,
          duration_minutes: newBooking.durationMinutes,
          service_price: newBooking.servicePrice,
          selected_add_ons: newBooking.selectedAddOns,
          therapist_id: newBooking.therapistId,
          therapist_name: newBooking.therapistName,
          therapist_photo: newBooking.therapistPhoto,
          therapist_phone: newBooking.therapistPhone,
          customer_name: newBooking.customerName,
          customer_phone: newBooking.customerPhone,
          customer_gender: newBooking.customerGender,
          customer_email: newBooking.customerEmail,
          booking_date: newBooking.bookingDate,
          booking_time_slot: newBooking.bookingTimeSlot,
          city: newBooking.city,
          kecamatan: newBooking.kecamatan,
          address: newBooking.address,
          address_notes: newBooking.addressNotes,
          place_type: newBooking.placeType,
          estimated_distance_km: newBooking.estimatedDistanceKm,
          transport_cost: newBooking.transportCost,
          transport_breakdown: newBooking.transportBreakdown,
          voucher_code: newBooking.voucherCode,
          voucher_discount: newBooking.voucherDiscount,
          total_amount: newBooking.totalAmount,
          payment_method: newBooking.paymentMethod,
          payment_status: newBooking.paymentStatus,
          status: newBooking.status,
          status_logs: newBooking.statusLogs,
          special_notes: newBooking.specialNotes,
          selected_oil: newBooking.selectedOil,
          pressure_level: newBooking.pressureLevel,
          focus_areas: newBooking.focusAreas
        }
      ]).then(({ error }) => {
        if (error) console.error('Supabase booking sync error:', error.message);
        else console.log('Booking successfully synced to Supabase');
      });
    }

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, note?: string) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    let defaultNote = '';
    switch (status) {
      case 'therapist_on_the_way':
        defaultNote = 'Terapis sedang dalam perjalanan menuju lokasi Anda.';
        break;
      case 'therapist_arrived':
        defaultNote = 'Terapis telah sampai di lokasi penjemputan/rumah.';
        break;
      case 'in_session':
        defaultNote = 'Sesi terapi sedang berlangsung dengan aman dan nyaman.';
        break;
      case 'completed':
        defaultNote = 'Layanan selesai. Terima kasih atas kepercayaan Anda.';
        break;
      case 'cancelled':
        defaultNote = 'Pesanan dibatalkan.';
        break;
      default:
        defaultNote = 'Status diperbarui.';
    }

    let updatedRecord: BookingItem | null = null;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        if (status === 'completed' && b.status !== 'completed') {
          addPoints(1000);
          showToast('Selamat! Anda mendapatkan 1.000 Mimah Points 🌟', 'success');
        }
        const updated = {
          ...b,
          status,
          statusLogs: [
            ...b.statusLogs,
            { timestamp: timeStr, status, note: note || defaultNote }
          ]
        };
        if (activeBooking && activeBooking.id === bookingId) {
          setActiveBooking(updated);
        }
        
        // Trigger prominent notification
        setLastStatusUpdate({
          bookingId: b.id,
          bookingCode: b.bookingCode,
          status: status
        });

        updatedRecord = updated;
        return updated;
      }
      return b;
    }));

    showToast(`Status pesanan diperbarui ke: ${status.replace(/_/g, ' ')}`, 'info');

    // NEW: Auto WhatsApp Simulation Trigger inside updateBookingStatus
    setTimeout(() => {
      if (updatedRecord) {
        const b = updatedRecord as BookingItem;
        let waMsg = '';
        let waType = '';
        if (status === 'therapist_on_the_way') {
          waMsg = `Halo Kak ${b.customerName}, terapis kami (${b.therapistName}) sedang dalam perjalanan ke lokasi Kakak. Est. Kedatangan sesuai slot ${b.bookingTimeSlot} WIB. Mohon persiapkan diri Kakak ya!`;
          waType = 'Perjalanan Mitra';
        } else if (status === 'therapist_arrived') {
          waMsg = `Halo Kak ${b.customerName}, terapis kami (${b.therapistName}) telah sampai di depan rumah/lokasi Kakak. Terapis kami siap memulai sesi pijat ${b.serviceTitle}.`;
          waType = 'Mitra Sampai';
        } else if (status === 'in_session') {
          waMsg = `Halo Kak ${b.customerName}, sesi pijat ${b.serviceTitle} Kakak telah dimulai oleh Terapis ${b.therapistName}. Selamat menikmati layanan relaksasi bintang lima dari kami!`;
          waType = 'Sesi Dimulai';
        } else if (status === 'completed') {
          waMsg = `Halo Kak ${b.customerName}, layanan pijat ${b.serviceTitle} dari Mimah Spa oleh Terapis ${b.therapistName} telah selesai dilakukan. Terima kasih atas kepercayaan Kakak! Hubungi kami untuk pemesanan berikutnya.`;
          waType = 'Selesai Layanan';
        } else if (status === 'cancelled') {
          waMsg = `Halo Kak ${b.customerName}, pesanan Mimah Spa Kakak dengan kode ${b.bookingCode} telah resmi dibatalkan. Hubungi Customer Service jika ada pertanyaan.`;
          waType = 'Pesanan Batal';
        }
        
        if (waMsg) {
          // Add to local logs
          setWhatsappLogs(prev => [
            {
              id: `wa-log-${Date.now()}`,
              timestamp: new Date().toLocaleString('id-ID'),
              recipient: b.customerPhone,
              message: waMsg,
              type: waType
            },
            ...prev
          ]);

          // Real WhatsApp API Trigger
          fetch('/api/send-wa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              target: b.customerPhone,
              message: waMsg
            })
          }).then(res => res.json()).then(data => {
            if (data.success) {
              console.log('Real WA Sent Successfully via Fonnte');
            } else {
              console.warn('Real WA Failed (Check Fonnte Token):', data.error);
            }
          }).catch(err => console.error('WA API Error:', err));
        }
      }
    }, 200);

    // Background Supabase Sync
    if (supabase && updatedRecord) {
      const rec = updatedRecord as BookingItem;
      supabase.from('bookings').update({
        status: rec.status,
        status_logs: rec.statusLogs,
        payment_status: status === 'completed' ? 'paid' : rec.paymentStatus
      }).eq('id', bookingId).then(({ error }) => {
        if (error) console.error('Supabase booking status update error:', error.message);
        else console.log('Booking status successfully synced to Supabase');
      });
    }
  };

  const addTherapist = (data: any): Therapist => {
    const newTherapist: Therapist = {
      ...data,
      id: data.id || `terapis-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      completedOrders: 0,
      totalHours: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      dailyEarnings: 0,
      monthlyEarnings: 0,
      commissionRate: data.commissionRate || 0.75,
      isTopTherapist: false,
    };

    setTherapists(prev => [newTherapist, ...prev]);
    showToast(`Terapis ${newTherapist.name} berhasil ditambahkan!`, 'success');

    // Background Supabase Sync
    if (supabase) {
      supabase.from('therapists').insert([
        {
          id: newTherapist.id,
          name: newTherapist.name,
          phone: newTherapist.phone,
          photo: newTherapist.photoUrl,
          gender: newTherapist.gender,
          rating: newTherapist.rating,
          review_count: newTherapist.reviewCount,
          status: newTherapist.status || 'offline',
          city: newTherapist.baseCity || 'Kota Medan',
          skills: newTherapist.specialties || [],
          bio: newTherapist.bio || '',
          joined_date: newTherapist.joinedDate,
          commission_rate: newTherapist.commissionRate,
          is_top_therapist: newTherapist.isTopTherapist
        }
      ]).then(({ error }) => {
        if (error) console.error('Supabase therapist sync error:', error.message);
        else console.log('Therapist successfully synced to Supabase');
      });
    }

    return newTherapist;
  };

  const updateTherapist = (id: string, updates: Partial<Therapist>) => {
    let updatedRecord: Therapist | null = null;
    setTherapists(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        updatedRecord = updated;
        return updated;
      }
      return t;
    }));
    showToast('Data terapis berhasil diperbarui!', 'success');

    // Background Supabase Sync
    if (supabase && updatedRecord) {
      const rec = updatedRecord as Therapist;
      const isOnline = rec.status === 'online';
      supabase.from('therapists').update({
        name: rec.name,
        phone: rec.phone,
        photo_url: rec.photoUrl,
        city: rec.baseCity,
        specialties: rec.specialties,
        bio: rec.bio,
        commission_rate: rec.commissionRate
      }).eq('id', id).then(({ error }) => {
        if (error) {
          console.warn('Supabase therapist update notice:', error.message);
        } else {
          console.log('Therapist updates successfully synced to Supabase');
        }
      });
    }
  };

  const deleteTherapist = (id: string) => {
    setTherapists(prev => prev.filter(t => t.id !== id));
    showToast('Terapis berhasil dihapus dari sistem.', 'info');

    // Background Supabase Sync
    if (supabase) {
      supabase.from('therapists').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase therapist delete error:', error.message);
        else console.log('Therapist successfully deleted from Supabase');
      });
    }
  };

  const toggleTherapistStatus = (id: string) => {
    let nextStatus: TherapistStatus = 'offline';
    setTherapists(prev => prev.map(t => {
      if (t.id === id) {
        nextStatus = (t.status === 'online' ? 'offline' : 'online') as TherapistStatus;
        showToast(`Status ${t.name} diubah menjadi ${nextStatus.toUpperCase()}`, 'info');
        return { ...t, status: nextStatus };
      }
      return t;
    }));

    // Background Supabase Sync
    if (supabase) {
      const isAvail = (nextStatus as string) === 'online';
      supabase.from('therapists').update({ 
        is_available: isAvail
      }).eq('id', id).then(({ error }) => {
        if (error) {
          console.warn('Supabase therapist status toggle notice:', error.message);
        } else {
          console.log('Therapist status successfully updated in Supabase');
        }
      });
    }
  };

  const updateTherapistSchedule = (therapistId: string, schedule: Record<string, string[]>) => {
    setTherapists(prev => prev.map(t => {
      if (t.id === therapistId) {
        return { ...t, schedule };
      }
      return t;
    }));
    showToast('Jadwal kerja Anda berhasil diperbarui!', 'success');

    if (supabase) {
      supabase.from('therapists').update({ schedule }).eq('id', therapistId).then(({ error }) => {
        if (error) console.error('Supabase schedule update error:', error.message);
      });
    }
  };

  const updateGlobalSettings = (settings: GlobalSettings) => {
    setGlobalSettings(settings);
    localStorage.setItem('mimah_global_settings_v1', JSON.stringify(settings));
    showToast('Pengaturan sistem berhasil diperbarui!', 'success');
  };

  const awardPointsToCustomer = (phone: string, points: number) => {
    setCustomerProfiles(prev => prev.map(c => {
      if (c.phone === phone) {
        return { ...c, loyaltyPoints: c.loyaltyPoints + points };
      }
      return c;
    }));
    showToast(`Berhasil memberikan ${points} poin hadiah!`, 'success');
  };

  const submitReview = (therapistId: string, bookingId: string, rating: number, comment: string, customerName: string) => {
    const newReview: TherapistReview = {
      id: `rev-${Date.now()}`,
      therapistId,
      customerName: customerName || 'Klien Mimah Spa',
      customerCity: selectedCity,
      rating,
      serviceTitle: 'Home Service Therapy',
      comment,
      date: 'Baru saja',
      verified: true,
    };

    setReviews(prev => [newReview, ...prev]);
    
    // Update therapist stats
    let updatedTherapist: Therapist | null = null;
    setTherapists(prev => prev.map(t => {
      if (t.id === therapistId) {
        const newReviewCount = t.reviewCount + 1;
        const newRating = Number(((t.rating * t.reviewCount + rating) / newReviewCount).toFixed(2));
        const updated = {
          ...t,
          reviewCount: newReviewCount,
          rating: newRating,
        };
        updatedTherapist = updated;
        return updated;
      }
      return t;
    }));

    // Update booking review
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, rating, reviewText: comment };
      }
      return b;
    }));

    showToast('Terima kasih atas ulasan & rating yang Anda berikan!', 'success');

    // Background Supabase Sync
    if (supabase) {
      // 1. Insert Review
      supabase.from('reviews').insert([
        {
          id: newReview.id,
          therapist_id: newReview.therapistId,
          customer_name: newReview.customerName,
          customer_city: newReview.customerCity,
          rating: newReview.rating,
          service_title: newReview.serviceTitle,
          comment: newReview.comment,
          date: newReview.date,
          verified: newReview.verified
        }
      ]).then(({ error }) => {
        if (error) console.error('Supabase review insert error:', error.message);
        else console.log('Review successfully synced to Supabase');
      });

      // 2. Update Therapist Rating & Review Count
      if (updatedTherapist) {
        const t = updatedTherapist as Therapist;
        supabase.from('therapists').update({
          rating: t.rating,
          review_count: t.reviewCount
        }).eq('id', therapistId).then(({ error }) => {
          if (error) console.error('Supabase therapist rating update error:', error.message);
        });
      }

      // 3. Update Booking rating and text
      supabase.from('bookings').update({
        rating,
        review_text: comment
      }).eq('id', bookingId).then(({ error }) => {
        if (error) console.error('Supabase booking review sync error:', error.message);
      });
    }
  };

  // Therapist Applications State
  const [therapistApplications, setTherapistApplications] = useState<TherapistApplication[]>(() => {
    const saved = localStorage.getItem('mimah_therapist_apps');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'app-101',
        fullName: 'Rina Sastrawati',
        phone: '081266778899',
        email: 'rina.sastra@gmail.com',
        gender: 'female',
        age: 28,
        city: 'Kota Medan',
        kecamatan: 'Medan Kota',
        experienceYears: 4,
        specialties: ['Pijat Tradisional', 'Refleksi Foot Spa', 'Lulur & Totok Wajah'],
        certifications: 'Sertifikat LKP Massage Medan 2021',
        motivation: 'Ingin bergabung menjadi terapis profesional panggilan dengan jam kerja fleksibel di Mimah Spa.',
        status: 'pending',
        createdAt: new Date().toLocaleDateString('id-ID')
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mimah_therapist_apps', JSON.stringify(therapistApplications));
  }, [therapistApplications]);

  const submitTherapistApplication = (data: Omit<TherapistApplication, 'id' | 'status' | 'createdAt'>) => {
    const newApp: TherapistApplication = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('id-ID')
    };
    setTherapistApplications(prev => [newApp, ...prev]);
    showToast('Pendaftaran Anda berhasil dikirim! Tim Mimah Spa akan menghubungi Anda via WhatsApp.', 'success');
  };

  const updateTherapistApplicationStatus = (id: string, status: TherapistApplication['status']) => {
    setTherapistApplications(prev => prev.map(a => {
      if (a.id === id) {
        if (status === 'accepted') {
          // Auto create therapist profile when accepted
          addTherapist({
            name: a.fullName,
            gender: a.gender,
            age: a.age,
            photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
            phone: a.phone,
            experienceYears: a.experienceYears,
            specialties: a.specialties,
            baseCity: a.city,
            baseKecamatan: a.kecamatan,
            operationalCities: ['Kota Medan'],
            bio: a.motivation,
            status: 'offline',
            vaccinated: true,
            equipmentProvided: ['Minyak Zaitun', 'Kain Linen Steril', 'Aromaterapi'],
            assignedInventory: [],
            certifications: [
              { name: a.certifications || 'Sertifikat Kompetensi Spa', issuer: 'LKP Spa Medan', year: 2023, verified: true }
            ]
          });
        }
        return { ...a, status };
      }
      return a;
    }));
    showToast(`Status pendaftaran terapis diperbarui menjadi ${status.toUpperCase()}`, 'info');
  };

  // State & Functions for Add-on Upsells & Instant Cashouts
  const [cashoutRequests, setCashoutRequests] = useState<CashoutRequest[]>(() => {
    const saved = localStorage.getItem('mimah_cashout_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('mimah_cashout_requests', JSON.stringify(cashoutRequests));
  }, [cashoutRequests]);

  const requestCashout = (therapistId: string, amount: number, paymentMethod: string, accountNo: string, accountName: string) => {
    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) return;

    const currentBalance = therapist.dailyEarnings || 480000;
    if (amount > currentBalance) {
      showToast('Saldo dompet komisi Anda tidak mencukupi', 'warning');
      return;
    }

    const newRequest: CashoutRequest = {
      id: `cashout-${Date.now()}`,
      therapistId,
      therapistName: therapist.name,
      amount,
      paymentMethod,
      accountNo,
      accountName,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('id-ID')
    };

    updateTherapist(therapistId, {
      dailyEarnings: currentBalance - amount
    });

    setCashoutRequests(prev => [newRequest, ...prev]);
    showToast('Permintaan penarikan komisi diajukan! Harap tunggu transfer admin dalam 1x24 jam.', 'success');
  };

  const updateCashoutRequestStatus = (id: string, status: 'completed' | 'rejected') => {
    setCashoutRequests(prev => prev.map(r => {
      if (r.id === id) {
        if (status === 'rejected') {
          const th = therapists.find(t => t.id === r.therapistId);
          if (th) {
            updateTherapist(r.therapistId, {
              dailyEarnings: (th.dailyEarnings || 0) + r.amount
            });
          }
        }
        return { ...r, status };
      }
      return r;
    }));
    showToast(`Permintaan pencairan komisi diperbarui ke: ${status.toUpperCase()}`, 'info');
  };

  const addAddonToBooking = (bookingId: string, addonId: string) => {
    const addon = addOns.find(a => a.id === addonId);
    if (!addon) return;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        if (b.selectedAddOns.some(item => item.id === addonId)) {
          showToast('Tambahan layanan ini sudah ditambahkan sebelumnya', 'warning');
          return b;
        }
        
        const updatedAddOns = [...b.selectedAddOns, {
          id: addon.id,
          name: addon.name,
          price: addon.price,
          durationMinutes: addon.durationMinutes
        }];
        
        const updated = {
          ...b,
          selectedAddOns: updatedAddOns,
          durationMinutes: b.durationMinutes + addon.durationMinutes,
          totalAmount: b.totalAmount + addon.price,
          servicePrice: b.servicePrice + addon.price,
          statusLogs: [
            ...b.statusLogs,
            { 
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), 
              status: b.status, 
              note: `Tambahan layanan ditambahkan di tempat: ${addon.name} (+${addon.durationMinutes} Menit, +Rp ${addon.price.toLocaleString('id-ID')})` 
            }
          ]
        };

        if (activeBooking && activeBooking.id === bookingId) {
          setActiveBooking(updated);
        }
        showToast(`Berhasil menambahkan ${addon.name} ke sesi!`, 'success');
        return updated;
      }
      return b;
    }));
  };

  const assignTherapist = (bookingId: string, therapist: Therapist) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updated = {
          ...b,
          therapistId: therapist.id,
          therapistName: therapist.name,
          therapistPhone: therapist.phone,
          therapistPhoto: therapist.photoUrl,
          status: 'confirmed' as BookingStatus,
          statusLogs: [
            ...b.statusLogs,
            { 
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), 
              status: 'confirmed' as BookingStatus, 
              note: `Terapis ${therapist.name} telah ditugaskan ke pesanan Anda.` 
            }
          ]
        };
        
        if (activeBooking && activeBooking.id === bookingId) {
          setActiveBooking(updated);
        }
        
        showToast(`Terapis ${therapist.name} berhasil ditugaskan!`, 'success');
        return updated;
      }
      return b;
    }));
  };

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      // Clear all possible session indicators
      localStorage.removeItem('nsc_user_role');
      localStorage.removeItem('mimah_points');
      
      // Reset state immediately to customer view
      setUserRole('customer');
      setUser(null);
      setActiveAdminTab('analytics');
      setActiveCustomerTab('katalog');
      
      showToast('Berhasil keluar dari portal & kembali ke mode pelanggan.', 'info');
      
      // Smooth scroll to top
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        userRole,
        setUserRole,
        selectedCity,
        setSelectedCity,
        selectedKecamatan,
        setSelectedKecamatan,
        therapists,
        addOns,
        cities,
        vouchers,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        services,
        addService,
        updateService,
        deleteService,
        reviews,
        tariffConfig,
        updateTariffConfig,
        bookings,
        activeBooking,
        setActiveBooking,
        createBooking,
        updateBookingStatus,
        addTherapist,
        updateTherapist,
        deleteTherapist,
        toggleTherapistStatus,
        selectedTherapistForBooking,
        setSelectedTherapistForBooking,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isLoyaltyModalOpen,
        setIsLoyaltyModalOpen,
        viewingTherapist,
        setViewingTherapist,
        submitReview,
        currentTherapistId,
        setCurrentTherapistId,
        activeCustomerTab,
        setActiveCustomerTab,
        activeAdminTab,
        setActiveAdminTab,
        userPoints,
        addPoints,
        deductPoints,
        notificationToast,
        showToast,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        updateTherapistInventory,
        whatsappNumber,
        updateWhatsappNumber,
        stockRequests,
        createStockRequest,
        approveStockRequest,
        rejectStockRequest,
        whatsappLogs,
        clearWhatsappLogs,
        addWhatsappLog,
        // Membership & Referral
        activeSubscription: null,
        buySubscription: () => {},
        referralCode: 'MIMAH-MEDAN-88',
        referralHistory: [
          { id: 'ref-1', friendName: 'Budi Santoso', date: '01/09/2026', rewardPoints: 2500, status: 'completed' },
          { id: 'ref-2', friendName: 'Siti Rahma', date: '05/09/2026', rewardPoints: 2500, status: 'completed' }
        ],
        claimReferral: (friendName: string) => {
          addPoints(2500);
          showToast(`Berhasil klaim bonus referral dari ${friendName}! +2.500 Poin`, 'success');
        },
        // SOS & Client Care
        sosAlerts,
        triggerSOSAlert,
        resolveSOSAlert,
        clientCareNotes,
        saveClientCareNote,
        // Admin Refunds
        refundDisputes,
        submitRefundDispute,
        approveRefundDispute,
        rejectRefundDispute,
        // Therapist Applications
        therapistApplications,
        submitTherapistApplication,
        updateTherapistApplicationStatus,
        // Upsell & Cashout
        addAddonToBooking,
        requestCashout,
        cashoutRequests,
        updateCashoutRequestStatus,
        updateTherapistSchedule,
        customerProfiles,
        globalSettings,
        updateGlobalSettings,
        awardPointsToCustomer,
        logout,
        isDbConnected,
        lastStatusUpdate,
        clearLastStatusUpdate,
        assignTherapist
      }}
    >
      <Toaster richColors position="top-right" />
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
