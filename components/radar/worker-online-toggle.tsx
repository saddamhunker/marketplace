"use client";

import { useEffect, useState } from "react";
import { LocateFixed, Power } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function WorkerOnlineToggle({ compact = false }: { compact?: boolean }) {
  const [online, setOnline] = useState(false);
  const [message, setMessage] = useState("Now Offline. Go online to appear on the live worker radar.");

  useEffect(() => {
    if (!online || !navigator.geolocation) return;

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const session = isSupabaseConfigured() ? (await createClient().auth.getSession()).data.session : null;
          const response = await fetch("/api/radar/worker-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
            },
            body: JSON.stringify({
              isOnline: true,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              updateIntervalSeconds: 30
            })
          });
          const payload = await response.json().catch(() => ({}));

          if (!response.ok) {
            setOnline(false);
            setMessage(payload.error === "Worker profile required" ? "Worker profile required. Login as worker ya worker profile create karo." : payload.error ?? "Online status update failed.");
            return;
          }

          setMessage("Now Online. Updating GPS every 30 seconds for live radar.");
        },
        () => {
          setOnline(false);
          setMessage("Now Offline. Location permission needed to go online.");
        }
      );
    };

    sendLocation();
    const interval = window.setInterval(sendLocation, 30000);

    return () => window.clearInterval(interval);
  }, [online]);

  async function toggleStatus() {
    if (online) {
      setOnline(false);
      setMessage("Now Offline. You are hidden from the live radar.");
      const session = isSupabaseConfigured() ? (await createClient().auth.getSession()).data.session : null;
      const response = await fetch("/api/radar/worker-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ isOnline: false, latitude: 0, longitude: 0, updateIntervalSeconds: 30 })
      }).catch(() => undefined);
      if (!response?.ok) setMessage("Now Offline locally. Server update login/worker profile ke bina save nahi hua.");
      return;
    }

    setOnline(true);
    setMessage("Requesting location permission...");
  }

  if (compact) {
    return (
      <button
        onClick={toggleStatus}
        className={`focus-ring grid h-11 w-11 place-items-center rounded-2xl text-white shadow-sm ${online ? "bg-mint" : "bg-red-500"}`}
        aria-label={online ? "Now Online. Go offline" : "Now Offline. Go online"}
        title={online ? "Now Online" : "Now Offline"}
      >
        {online ? <LocateFixed className="h-5 w-5" /> : <Power className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <div className="premium-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-saffron">Worker Radar</p>
          <h2 className="text-2xl font-black">Online / Offline Status</h2>
          <p className={`mt-2 text-sm font-black ${online ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300"}`}>{message}</p>
        </div>
        <button onClick={toggleStatus} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-white shadow-lg ${online ? "bg-red-500 shadow-red-500/20" : "bg-gradient-to-r from-mint to-emerald-500 shadow-emerald-500/20"}`}>
          {online ? <Power className="h-4 w-4" /> : <LocateFixed className="h-4 w-4" />}
          {online ? "Now Online - Go Offline" : "Now Offline - Go Online"}
        </button>
      </div>
    </div>
  );
}
