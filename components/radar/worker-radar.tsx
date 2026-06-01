"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { BadgeCheck, CheckCircle2, Clock, LocateFixed, MapPin, MessageCircle, Phone, Radio, ShieldCheck, XCircle } from "lucide-react";
import { workerCategories, type RadarWorker } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const serviceTypes = [...workerCategories.map((category) => category.name), "Delivery"];
const bookingSteps = ["Requested", "Accepted", "On The Way", "Arrived", "Completed"];

type UserLocation = { lat: number; lng: number };
type BookingState = {
  serviceType: string;
  status: string;
  worker?: RadarWorker;
  note?: string;
};

type RadarApiWorker = {
  id?: string;
  worker_profile_id?: string;
  skill?: string;
  availability?: string;
  latitude?: number;
  longitude?: number;
  is_online?: boolean;
  profiles?: { full_name?: string | null; phone?: string | null; whatsapp?: string | null } | null;
  worker_live_locations?: {
    latitude?: number | null;
    longitude?: number | null;
    is_online?: boolean | null;
  }[] | {
    latitude?: number | null;
    longitude?: number | null;
    is_online?: boolean | null;
  } | null;
  worker_profiles?: {
    id?: string;
    skill?: string;
    availability?: string;
    latitude?: number | null;
    longitude?: number | null;
    profiles?: { full_name?: string | null; phone?: string | null; whatsapp?: string | null } | null;
    trust_scores?: { score?: number | null } | null;
  } | null;
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(from: UserLocation, to: UserLocation) {
  const radius = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return Number((2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}

function normalizeApiWorker(worker: RadarApiWorker, userLocation: UserLocation): RadarWorker | null {
  const liveLocation = Array.isArray(worker.worker_live_locations) ? worker.worker_live_locations[0] : worker.worker_live_locations;
  const liveLat = liveLocation?.is_online && typeof liveLocation.latitude === "number" ? liveLocation.latitude : undefined;
  const liveLng = liveLocation?.is_online && typeof liveLocation.longitude === "number" ? liveLocation.longitude : undefined;
  const directLiveLat = worker.is_online && typeof worker.latitude === "number" ? worker.latitude : undefined;
  const directLiveLng = worker.is_online && typeof worker.longitude === "number" ? worker.longitude : undefined;
  const profileLat = typeof worker.latitude === "number" ? worker.latitude : worker.worker_profiles?.latitude ?? undefined;
  const profileLng = typeof worker.longitude === "number" ? worker.longitude : worker.worker_profiles?.longitude ?? undefined;
  const lat = directLiveLat ?? liveLat ?? profileLat;
  const lng = directLiveLng ?? liveLng ?? profileLng;

  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const km = distanceKm(userLocation, { lat, lng });
  const locationSource = directLiveLat !== undefined || liveLat !== undefined ? "live" : "profile";
  const profile = worker.profiles ?? worker.worker_profiles?.profiles ?? null;
  const online = locationSource === "live" || worker.availability === "Available Now" || worker.worker_profiles?.availability === "Available Now";

  return {
    id: worker.id ?? worker.worker_profile_id ?? worker.worker_profiles?.id ?? `${lat}-${lng}`,
    name: profile?.full_name ?? "Online Worker",
    skill: worker.skill ?? worker.worker_profiles?.skill ?? "Worker",
    rating: 4.7,
    verified: Number(worker.worker_profiles?.trust_scores?.score ?? 70) >= 70,
    phone: profile?.phone ?? "+91 98765 00000",
    whatsapp: profile?.whatsapp ?? "919876500000",
    lat,
    lng,
    distanceKm: km,
    etaMinutes: Math.max(5, Math.round(km * 4)),
    online,
    locationSource
  };
}

export function WorkerRadar() {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation>({ lat: 28.6139, lng: 77.209 });
  const [locationStatus, setLocationStatus] = useState("Use your current location for accurate nearby workers.");
  const [radiusKm, setRadiusKm] = useState(5);
  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const [selectedWorker, setSelectedWorker] = useState<RadarWorker | null>(null);
  const [booking, setBooking] = useState<BookingState | null>(null);
  const [workersSource, setWorkersSource] = useState<RadarWorker[]>([]);

  const onlineWorkers = useMemo(
    () => workersSource.filter((worker) => worker.online && worker.distanceKm <= radiusKm),
    [radiusKm, workersSource]
  );

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    let active = true;

    async function setupMap() {
      const L = await import("leaflet");
      if (!active || !mapNodeRef.current) return;

      const map = L.map(mapNodeRef.current, {
        zoomControl: false,
        attributionControl: true
      }).setView([userLocation.lat, userLocation.lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapRef.current = map;
    }

    setupMap();

    return () => {
      active = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [userLocation.lat, userLocation.lng]);

  useEffect(() => {
    if (!navigator.geolocation) {
        setLocationStatus("Location is not supported in this browser. Exact radar distance unavailable.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(nextLocation);
        setLocationStatus("Location detected. Showing online workers near you.");
        mapRef.current?.setView([nextLocation.lat, nextLocation.lng], 13);
      },
      () => setLocationStatus("Location permission allow karo, tab exact nearby workers dikhenge.")
    );
  }, []);

  useEffect(() => {
    let active = true;

    async function loadOnlineWorkers() {
      try {
        const response = await fetch("/api/radar/workers", { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        if (!active) return;

        if (!response.ok || !Array.isArray(payload.data)) {
          setWorkersSource([]);
          return;
        }

        const normalized = payload.data.map((worker: RadarApiWorker | RadarWorker) => {
          if ("lat" in worker && "lng" in worker) return worker as RadarWorker;
          return normalizeApiWorker(worker as RadarApiWorker, userLocation);
        }).filter(Boolean) as RadarWorker[];
        setWorkersSource(normalized);
      } catch {
        if (active) setWorkersSource([]);
      }
    }

    loadOnlineWorkers();
    const interval = window.setInterval(loadOnlineWorkers, 30000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;

    async function renderMarkers() {
      const L = await import("leaflet");
      if (cancelled || !mapRef.current) return;

      markerRef.current.forEach((marker) => marker.remove());
      markerRef.current = [];

      const userIcon = L.divIcon({
        className: "",
        html: "<div class='radar-user-dot'><span class='h-2 w-2 rounded-full bg-white'></span></div>",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      markerRef.current.push(L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(mapRef.current));

      onlineWorkers.forEach((worker) => {
        const icon = L.divIcon({
          className: "",
          html: `<button class="radar-worker-dot">${worker.skill.slice(0, 1)}</button>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([worker.lat, worker.lng], { icon })
          .addTo(mapRef.current!)
          .bindPopup(`<strong>${worker.name}</strong><br/>${worker.skill} • ${worker.rating} ★<br/>${worker.distanceKm} km away (${worker.locationSource === "profile" ? "approx" : "live"})`);

        marker.on("click", () => setSelectedWorker(worker));
        markerRef.current.push(marker);
      });
    }

    renderMarkers();

    return () => {
      cancelled = true;
    };
  }, [onlineWorkers, userLocation]);

  async function requestWorkerNow() {
    const worker = onlineWorkers.find((item) => item.skill === serviceType) ?? onlineWorkers[0];
    if (!worker) {
      setBooking({ serviceType, status: "Requested", note: "Abhi koi worker online/profile location ke saath available nahi hai. Worker ko Go Online karna hoga ya profile location save karni hogi." });
      return;
    }
    setSelectedWorker(worker ?? null);
    setBooking({ serviceType, status: "Requested", worker });

    try {
      const session = isSupabaseConfigured() ? (await createClient().auth.getSession()).data.session : null;
      const response = await fetch("/api/radar/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          serviceType,
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radiusKm
        })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setBooking({
          serviceType,
          status: "Requested",
          worker,
          note: response.status === 401 ? "Demo request shown. Real booking ke liye login required hai." : payload.error ?? "Booking API unavailable, WhatsApp/call fallback use karo."
        });
      } else {
        setBooking({ serviceType, status: "Requested", worker, note: "Booking request saved. Nearby workers ko alert ready hai." });
      }
    } catch {
      setBooking({ serviceType, status: "Requested", worker, note: "Network issue. Demo tracking aur WhatsApp fallback active hai." });
    }

    window.setTimeout(() => {
      if (worker) setBooking((current) => ({ serviceType, status: "Accepted", worker, note: current?.note }));
    }, 1200);

    window.setTimeout(() => {
      if (worker) setBooking((current) => ({ serviceType, status: "On The Way", worker, note: current?.note }));
    }, 2600);
  }

  const activeWorker = booking?.worker ?? selectedWorker ?? onlineWorkers[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <div className="premium-card min-h-[68vh] p-3">
        <div className="relative h-[68vh] min-h-[560px] overflow-hidden rounded-[1.5rem]">
          <div ref={mapNodeRef} className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] rounded-3xl border border-white/70 bg-white/88 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-black"><Radio className="h-4 w-4 text-mint" /> Live Nearby Worker Radar</p>
                <p className="mt-1 text-xs font-semibold text-zinc-500">{locationStatus}</p>
              </div>
              <span className="rounded-full bg-mint/10 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-200">{onlineWorkers.length} nearby</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-3 right-3 z-[500] grid gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[2, 5, 10].map((radius) => (
                <button key={radius} onClick={() => setRadiusKm(radius)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black shadow-lg ${radiusKm === radius ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-white text-ink dark:bg-zinc-900 dark:text-white"}`}>
                  {radius} km
                </button>
              ))}
            </div>
            {activeWorker ? (
              <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black">{activeWorker.name}</p>
                    <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{activeWorker.skill} • {activeWorker.distanceKm} km • {activeWorker.locationSource === "profile" ? "Approx" : "Live"} • {activeWorker.rating} ★</p>
                  </div>
                  {activeWorker.verified ? <span className="inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 text-xs font-black text-white"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span> : null}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a href={`tel:${activeWorker.phone}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-black dark:bg-zinc-800"><Phone className="h-4 w-4" /> Call</a>
                  <a href={`https://wa.me/${activeWorker.whatsapp}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-mint to-emerald-500 px-4 py-3 text-sm font-black text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                </div>
              </div>
          ) : null}
          {!onlineWorkers.length ? (
            <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-4 text-sm font-bold text-zinc-600 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90 dark:text-zinc-300">
              Abhi koi worker live GPS ke saath online nahi hai. Worker dashboard se Go Online karne ke baad exact distance yahan dikhega.
              Agar worker GPS off rakhta hai to profile mein saved latitude/longitude add karne ke baad approximate distance dikhega.
            </div>
          ) : null}
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="premium-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-saffron">Emergency</p>
              <h2 className="text-2xl font-black">Need Worker Now</h2>
            </div>
            <LocateFixed className="h-7 w-7 text-mint" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {serviceTypes.map((service) => (
              <button key={service} onClick={() => setServiceType(service)} className={`rounded-2xl px-3 py-3 text-sm font-black ${serviceType === service ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"}`}>
                {service}
              </button>
            ))}
          </div>
          <button onClick={requestWorkerNow} className="mt-4 w-full rounded-[1.35rem] bg-gradient-to-r from-red-500 via-saffron to-rose-500 px-5 py-4 text-base font-black text-white shadow-xl shadow-red-500/20">
            Need Worker Now
          </button>
          <p className="mt-3 text-xs font-semibold text-zinc-500">Sends instant alert to nearby workers. Live GPS gives exact distance; saved profile location gives approximate distance.</p>
        </div>

        <div className="premium-card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-black"><ShieldCheck className="h-5 w-5 text-mint" /> Booking Status</h3>
          {booking ? (
            <>
              <div className="space-y-3">
                {bookingSteps.map((step) => {
                  const active = bookingSteps.indexOf(step) <= bookingSteps.indexOf(booking.status);
                  return (
                    <div key={step} className="flex items-center gap-3">
                      {active ? <CheckCircle2 className="h-5 w-5 text-mint" /> : <Clock className="h-5 w-5 text-zinc-400" />}
                      <span className={`text-sm font-black ${active ? "text-ink dark:text-white" : "text-zinc-400"}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
              {booking.worker ? (
                <div className="mt-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950/60">
                  <p className="font-black">{booking.worker.name}</p>
                  <p className="text-sm text-zinc-500">Arriving in {booking.worker.etaMinutes} mins</p>
                </div>
              ) : null}
              {booking.note ? <p className="mt-3 rounded-2xl bg-saffron/10 p-3 text-xs font-bold text-amber-700 dark:text-amber-200">{booking.note}</p> : null}
            </>
          ) : (
            <div className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-500 dark:bg-zinc-950/60">No active booking yet.</div>
          )}
        </div>

        <div className="premium-card max-h-[420px] overflow-hidden p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-black"><MapPin className="h-5 w-5 text-saffron" /> Online Workers</h3>
          <div className="space-y-3 overflow-y-auto pr-1">
            {onlineWorkers.map((worker) => (
              <button key={worker.id} onClick={() => setSelectedWorker(worker)} className="w-full rounded-2xl bg-zinc-50 p-3 text-left transition hover:bg-zinc-100 dark:bg-zinc-950/60 dark:hover:bg-zinc-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black">{worker.name}</p>
                    <p className="text-xs font-semibold text-zinc-500">{worker.skill} • {worker.distanceKm} km • {worker.locationSource === "profile" ? "Approx" : "Live"} • ETA {worker.etaMinutes} min</p>
                  </div>
                  {worker.verified ? <BadgeCheck className="h-5 w-5 text-mint" /> : <XCircle className="h-5 w-5 text-zinc-400" />}
                </div>
              </button>
            ))}
            {!onlineWorkers.length ? <p className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-500 dark:bg-zinc-950/60">No workers with live GPS or saved profile location.</p> : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
