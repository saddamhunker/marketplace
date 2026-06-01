"use client";

import { useEffect, useState } from "react";
import type { GeoPoint } from "@/lib/geo";

let cachedLocation: GeoPoint | null = null;
let pendingLocation: Promise<GeoPoint | null> | null = null;

function requestLocation() {
  if (cachedLocation) return Promise.resolve(cachedLocation);
  if (pendingLocation) return pendingLocation;

  pendingLocation = new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        cachedLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        resolve(cachedLocation);
      },
      () => resolve(null),
      { enableHighAccuracy: false, maximumAge: 120000, timeout: 8000 }
    );
  });

  return pendingLocation;
}

export function useUserLocation() {
  const [location, setLocation] = useState<GeoPoint | null>(cachedLocation);

  useEffect(() => {
    let active = true;

    requestLocation().then((point) => {
      if (active) setLocation(point);
    });

    return () => {
      active = false;
    };
  }, []);

  return location;
}
