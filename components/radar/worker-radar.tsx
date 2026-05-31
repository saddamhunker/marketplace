"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { BadgeCheck, CheckCircle2, Clock, LocateFixed, MapPin, MessageCircle, Phone, Radio, ShieldCheck, XCircle } from "lucide-react";
import { radarWorkers, type RadarWorker } from "@/lib/data";

const serviceTypes = ["Electrician", "Plumber", "Mechanic", "AC Repair", "Carpenter", "Delivery", "Labour"];
const bookingSteps = ["Requested", "Accepted", "On The Way", "Arrived", "Completed"];

type UserLocation = { lat: number; lng: number };
type BookingState = {
  serviceType: string;
  status: string;
  worker?: RadarWorker;
};

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

  const onlineWorkers = useMemo(
    () => radarWorkers.filter((worker) => worker.online && worker.distanceKm <= radiusKm),
    [radiusKm]
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
      setLocationStatus("Location is not supported in this browser. Showing demo workers near Delhi.");
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
      () => setLocationStatus("Location permission not allowed. Showing demo nearby workers.")
    );
  }, []);

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
          .bindPopup(`<strong>${worker.name}</strong><br/>${worker.skill} • ${worker.rating} ★<br/>${worker.distanceKm} km away`);

        marker.on("click", () => setSelectedWorker(worker));
        markerRef.current.push(marker);
      });
    }

    renderMarkers();

    return () => {
      cancelled = true;
    };
  }, [onlineWorkers, userLocation]);

  function requestWorkerNow() {
    const worker = onlineWorkers.find((item) => item.skill === serviceType) ?? onlineWorkers[0];
    setSelectedWorker(worker ?? null);
    setBooking({ serviceType, status: "Requested", worker });

    window.setTimeout(() => {
      if (worker) setBooking({ serviceType, status: "Accepted", worker });
    }, 1200);

    window.setTimeout(() => {
      if (worker) setBooking({ serviceType, status: "On The Way", worker });
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
              <span className="rounded-full bg-mint/10 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-200">{onlineWorkers.length} online</span>
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
                    <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{activeWorker.skill} • {activeWorker.distanceKm} km • {activeWorker.rating} ★</p>
                  </div>
                  {activeWorker.verified ? <span className="inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 text-xs font-black text-white"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span> : null}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a href={`tel:${activeWorker.phone}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-black dark:bg-zinc-800"><Phone className="h-4 w-4" /> Call</a>
                  <a href={`https://wa.me/${activeWorker.whatsapp}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-mint to-emerald-500 px-4 py-3 text-sm font-black text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                </div>
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
          <p className="mt-3 text-xs font-semibold text-zinc-500">Sends instant FCM notification to nearby online workers, with WhatsApp/call fallback for urgent jobs.</p>
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
                    <p className="text-xs font-semibold text-zinc-500">{worker.skill} • {worker.distanceKm} km • ETA {worker.etaMinutes} min</p>
                  </div>
                  {worker.verified ? <BadgeCheck className="h-5 w-5 text-mint" /> : <XCircle className="h-5 w-5 text-zinc-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
