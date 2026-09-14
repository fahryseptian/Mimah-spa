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

const MEDAN_BASE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'medan baru': { lat: 3.5685, lng: 98.6575 },
  'medan johor': { lat: 3.5284, lng: 98.6781 },
  'medan barat': { lat: 3.6062, lng: 98.6652 },
  'medan petisah': { lat: 3.5936, lng: 98.6672 },
  'medan selayang': { lat: 3.5412, lng: 98.6324 },
  'medan sunggal': { lat: 3.5824, lng: 98.6189 },
  'medan kota': { lat: 3.5786, lng: 98.6854 },
  'medan maimun': { lat: 3.5742, lng: 98.6821 },
  'medan tembung': { lat: 3.6012, lng: 98.7185 },
  'medan helvetia': { lat: 3.6089, lng: 98.6341 },
  'medan amplas': { lat: 3.5358, lng: 98.7062 }
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

      // C. Jarak Koordinat dari Pos Terapis ke Lokasi Pelanggan
      if (booking.customerLat && booking.customerLng) {
        const baseKey = t.baseKecamatan.toLowerCase().trim();
        const therapistCoords = MEDAN_BASE_COORDINATES[baseKey] || { lat: 3.5952, lng: 98.6722 };
        
        const distance = calculateHaversineDistance(
          booking.customerLat, 
          booking.customerLng, 
          therapistCoords.lat, 
          therapistCoords.lng
        );
        
        if (distance < 3) {
          score += 90;
          reasons.push(`Jarak sangat dekat (${distance.toFixed(1)} km)`);
        } else if (distance < 7) {
          score += 60;
          reasons.push(`Jarak dekat (${distance.toFixed(1)} km)`);
        } else if (distance < 12) {
          score += 30;
          reasons.push(`Jarak terjangkau (${distance.toFixed(1)} km)`);
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
