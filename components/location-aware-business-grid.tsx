"use client";

import { useMemo } from "react";
import { BusinessCard } from "@/components/business-card";
import { useUserLocation } from "@/components/use-user-location";
import type { Business } from "@/lib/data";
import { distanceKm, getBusinessPoint } from "@/lib/geo";

function sortByNearest(businesses: Business[], userLocation: { lat: number; lng: number } | null) {
  if (!userLocation) return businesses;

  return [...businesses].sort((left, right) => {
    const leftPoint = getBusinessPoint(left);
    const rightPoint = getBusinessPoint(right);
    const leftDistance = leftPoint ? distanceKm(userLocation, leftPoint) : Number.POSITIVE_INFINITY;
    const rightDistance = rightPoint ? distanceKm(userLocation, rightPoint) : Number.POSITIVE_INFINITY;
    return leftDistance - rightDistance;
  });
}

export function LocationAwareBusinessGrid({ businesses, compact = false, limit, className = "grid gap-4 md:grid-cols-2 xl:grid-cols-4" }: { businesses: Business[]; compact?: boolean; limit?: number; className?: string }) {
  const userLocation = useUserLocation();
  const sortedBusinesses = useMemo(() => sortByNearest(businesses, userLocation), [businesses, userLocation]);
  const visibleBusinesses = typeof limit === "number" ? sortedBusinesses.slice(0, limit) : sortedBusinesses;

  return (
    <div className={className}>
      {visibleBusinesses.map((business) => <BusinessCard key={business.id} business={business} compact={compact} />)}
    </div>
  );
}
