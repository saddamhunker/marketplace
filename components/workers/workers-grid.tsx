"use client";

import { useEffect, useMemo, useState } from "react";
import { WorkerCard } from "@/components/ui";
import type { Worker } from "@/lib/data";
import { mapWorkerProfile, type WorkerProfileRow } from "@/lib/worker-mapper";

export function WorkersGrid() {
  const [remoteWorkers, setRemoteWorkers] = useState<Worker[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadWorkers() {
      try {
        const response = await fetch(`/api/workers?ts=${Date.now()}`, { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));

        if (!active) return;

        if (!response.ok) {
          setMessage("Live workers load nahi hue. Supabase connection check karo.");
          return;
        }

        const rows = Array.isArray(payload.data) ? payload.data : [];
        setRemoteWorkers(rows.map((row: WorkerProfileRow) => mapWorkerProfile(row)));
      } catch {
        if (active) setMessage("Network issue. Supabase workers load nahi hue.");
      }
    }

    loadWorkers();

    return () => {
      active = false;
    };
  }, []);

  const allWorkers = useMemo(() => {
    return remoteWorkers;
  }, [remoteWorkers]);

  return (
    <>
      {message ? <p className="mb-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">{message}</p> : null}
      <div className="mb-5 flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">
        Showing {allWorkers.length} trusted profiles around your city
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {allWorkers.map((worker) => <WorkerCard key={worker.id} worker={worker} featured={worker.trustScore > 92} />)}
      </div>
      {!allWorkers.length && !message ? <p className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">Abhi live workers load ho rahe hain...</p> : null}
    </>
  );
}
