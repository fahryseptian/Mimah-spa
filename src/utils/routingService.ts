export interface DrivingRouteResult {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lng] array for Leaflet Polyline
  isRealDrivingRoute: boolean;
  roadName?: string;
}

/**
 * Calculate straight-line Haversine distance in km
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 2.5;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const safeA = Math.min(1, Math.max(0, a));
  const c = 2 * Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA));
  return R * c;
};

// Empirical road winding factor for Medan street network (~32% extra for actual road paths)
const MEDAN_ROAD_FACTOR = 1.32;

/**
 * Synchronous road-distance estimator (converts straight-line to estimated real road driving distance)
 */
export const estimateDrivingDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const straightLine = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  const roadDist = Math.max(1.0, Math.round(straightLine * MEDAN_ROAD_FACTOR * 10) / 10);
  return isNaN(roadDist) ? 2.5 : roadDist;
};

/**
 * Fetch real car driving route from Open Source Routing Machine (OSRM) driving API.
 * Uses real car road network (jalur mobil), turn-by-turn road distances, and route geometry.
 */
export const getDrivingRoute = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<DrivingRouteResult> => {
  const straightLine = calculateHaversineDistance(originLat, originLng, destLat, destLng);
  const fallbackRoadDist = estimateDrivingDistanceKm(originLat, originLng, destLat, destLng);
  const fallbackDuration = Math.round((fallbackRoadDist / 25) * 60 + 5);

  if (straightLine < 0.05) {
    return {
      distanceKm: 0.5,
      durationMinutes: 3,
      coordinates: [[originLat, originLng], [destLat, destLng]],
      isRealDrivingRoute: false
    };
  }

  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const meters = route.distance;
        const seconds = route.duration;

        const distanceKm = Math.max(0.8, Math.round((meters / 1000) * 10) / 10);
        const durationMinutes = Math.max(3, Math.round(seconds / 60));

        // OSRM GeoJSON coordinates are [lng, lat]. Leaflet requires [lat, lng].
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (pt: [number, number]) => [pt[1], pt[0]]
        );

        return {
          distanceKm,
          durationMinutes,
          coordinates,
          isRealDrivingRoute: true,
          roadName: route.legs?.[0]?.summary || ''
        };
      }
    }
  } catch (err) {
    console.warn('OSRM routing fetch fallback to road factor:', err);
  }

  return {
    distanceKm: fallbackRoadDist,
    durationMinutes: fallbackDuration,
    coordinates: [[originLat, originLng], [destLat, destLng]],
    isRealDrivingRoute: false
  };
};
