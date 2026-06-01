"use client";

import type { Business } from "@/lib/data";
import { distanceKm, formatDistance, getBusinessPoint } from "@/lib/geo";
import { useUserLocation } from "@/components/use-user-location";

export function useBusinessDistance(business: Business) {
  const userLocation = useUserLocation();
  const businessPoint = getBusinessPoint(business);

  if (!userLocation || !businessPoint) return business.distance;

  return formatDistance(distanceKm(userLocation, businessPoint));
}

export function BusinessDistance({ business }: { business: Business }) {
  return <>{useBusinessDistance(business)}</>;
}
