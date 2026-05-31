"use client";

import { useEffect, useState } from "react";
import { LocateFixed, Power } from "lucide-react";

export function WorkerOnlineToggle() {
  const [online, setOnline] = useState(false);
  const [message, setMessage] = useState("Go online to appear on the live worker radar.");

  useEffect(() => {
    if (!online || !navigator.geolocation) return;

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setMessage("Online. Updating GPS every 30 seconds for low-cost tracking.");
          await fetch("/api/radar/worker-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isOnline: true,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              updateIntervalSeconds: 30
            })
          }).catch(() => undefined);
        },
        () => setMessage("Location permission needed to go online.")
      );
    };

    sendLocation();
    const interval = window.setInterval(sendLocation, 30000);

    return () => window.clearInterval(interval);
  }, [online]);

  async function toggleStatus() {
    if (online) {
      setOnline(false);
      setMessage("Offline. You are hidden from the live radar.");
      await fetch("/api/radar/worker-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline: false, latitude: 0, longitude: 0, updateIntervalSeconds: 30 })
      }).catch(() => undefined);
      return;
    }

    setOnline(true);
    setMessage("Requesting location permission...");
  }

  return (
    <div className="premium-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-saffron">Worker Radar</p>
          <h2 className="text-2xl font-black">Online / Offline Status</h2>
          <p className="mt-2 text-sm font-semibold text-zinc-500">{message}</p>
        </div>
        <button onClick={toggleStatus} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-white shadow-lg ${online ? "bg-red-500 shadow-red-500/20" : "bg-gradient-to-r from-mint to-emerald-500 shadow-emerald-500/20"}`}>
          {online ? <Power className="h-4 w-4" /> : <LocateFixed className="h-4 w-4" />}
          {online ? "Go Offline" : "Go Online"}
        </button>
      </div>
    </div>
  );
}
