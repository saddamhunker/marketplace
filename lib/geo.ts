import type { Business } from "@/lib/data";

export type GeoPoint = { lat: number; lng: number };

const locationCoordinates: { match: string; point: GeoPoint }[] = [
  { match: "delhi", point: { lat: 28.6139, lng: 77.209 } },
  { match: "karol bagh", point: { lat: 28.6514, lng: 77.1907 } },
  { match: "noida", point: { lat: 28.5355, lng: 77.391 } },
  { match: "sector 62", point: { lat: 28.62, lng: 77.3639 } },
  { match: "mumbai", point: { lat: 19.076, lng: 72.8777 } },
  { match: "andheri", point: { lat: 19.1363, lng: 72.8277 } },
  { match: "bengaluru", point: { lat: 12.9716, lng: 77.5946 } },
  { match: "indiranagar", point: { lat: 12.9784, lng: 77.6408 } },
  { match: "pune", point: { lat: 18.5204, lng: 73.8567 } },
  { match: "lucknow", point: { lat: 26.8467, lng: 80.9462 } },
  { match: "jaipur", point: { lat: 26.9124, lng: 75.7873 } },
  { match: "ahmedabad", point: { lat: 23.0225, lng: 72.5714 } },
  { match: "hyderabad", point: { lat: 17.385, lng: 78.4867 } },
  { match: "kolkata", point: { lat: 22.5726, lng: 88.3639 } },
  { match: "patna", point: { lat: 25.5941, lng: 85.1376 } },
  { match: "surat", point: { lat: 21.1702, lng: 72.8311 } },
  { match: "nagpur", point: { lat: 21.1458, lng: 79.0882 } },
  { match: "bhopal", point: { lat: 23.2599, lng: 77.4126 } },
  { match: "kochi", point: { lat: 9.9312, lng: 76.2673 } },
  { match: "raipur", point: { lat: 21.2514, lng: 81.6296 } },
  { match: "nashik", point: { lat: 19.9975, lng: 73.7898 } },
  { match: "ludhiana", point: { lat: 30.901, lng: 75.8573 } }
];

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceKm(from: GeoPoint, to: GeoPoint) {
  const radius = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return Number((2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function getBusinessPoint(business: Business): GeoPoint | null {
  if (typeof business.latitude === "number" && typeof business.longitude === "number") {
    return { lat: business.latitude, lng: business.longitude };
  }

  const normalizedLocation = business.location.toLowerCase();
  return locationCoordinates.find((item) => normalizedLocation.includes(item.match))?.point ?? null;
}
