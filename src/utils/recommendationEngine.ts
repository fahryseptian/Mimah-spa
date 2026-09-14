import { BookingItem, Therapist } from '../types';

export interface RecommendedTherapist extends Therapist {
  matchScore: number;
  matchReasons: string[];
  distanceKm?: number;
}

/**
 * Menghitung jarak antara dua koordinat menggunakan rumus Haversine
 */
export const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Mesin rekomendasi terapis otomatis untuk admin
 */
export const getRecommendedTherapists = (
  booking: BookingItem,
  therapists: Therapist[]
): RecommendedTherapist[] => {
  return therapists
    .filter(t => {
      // 1. Filter Gender (Jika ada preferensi)
      if (booking.therapistGenderPreference !== 'any' && t.gender !== booking.therapistGenderPreference) {
        return false;
      }
      // 2. Hanya yang Online/Available
      if (t.status !== 'online') return false;
      
      return true;
    })
    .map(t => {
      let score = 0;
      const reasons: string[] = [];

      // A. Geografis - Kecamatan (Prioritas Utama)
      if (t.baseKecamatan.toLowerCase() === booking.kecamatan.toLowerCase()) {
        score += 100;
        reasons.push('Berlokasi di Kecamatan yang sama');
      }

      // B. Geografis - Kota
      if (t.baseCity.toLowerCase() === booking.city.toLowerCase()) {
        score += 50;
        reasons.push('Berada di Kota yang sama');
      }

      // C. Jarak Koordinat (Jika tersedia)
      // Catatan: Terapis saat ini mungkin tidak punya Lat/Lng real-time di interface, 
      // tapi kita asumsikan jika ada, kita hitung.
      // Untuk demo, kita bisa gunakan Lat/Lng base area jika tersedia.
      if (booking.customerLat && booking.customerLng) {
        // Mock distance calculation for demo purposes if therapist coords are missing
        // In a real app, these would come from therapist's real-time position
        const mockTherapistLat = booking.customerLat + (Math.random() - 0.5) * 0.1;
        const mockTherapistLng = booking.customerLng + (Math.random() - 0.5) * 0.1;
        const distance = calculateHaversineDistance(
          booking.customerLat, 
          booking.customerLng, 
          mockTherapistLat, 
          mockTherapistLng
        );
        
        if (distance < 5) {
          score += 80;
          reasons.push('Jarak sangat dekat (< 5km)');
        } else if (distance < 10) {
          score += 40;
          reasons.push('Jarak moderat (< 10km)');
        }
      }

      // D. Rating & Kualitas
      if (t.rating >= 4.9) {
        score += 30;
        reasons.push('Rating sangat tinggi (Elite)');
      }

      // E. Pengalaman
      if (t.experienceYears >= 5) {
        score += 20;
        reasons.push('Sangat berpengalaman (> 5 tahun)');
      }

      // F. Spesialisasi (Jika layanan butuh sertifikat/spesialis)
      // Check if serviceTitle matches therapist specialties
      const isSpecialist = t.specialties.some(s => 
        booking.serviceTitle.toLowerCase().includes(s.toLowerCase()) || 
        s.toLowerCase().includes(booking.serviceTitle.toLowerCase())
      );
      if (isSpecialist) {
        score += 40;
        reasons.push('Spesialis di layanan ini');
      }

      return {
        ...t,
        matchScore: score,
        matchReasons: reasons
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5); // Ambil top 5 rekomendasi
};
