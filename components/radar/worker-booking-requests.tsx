"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, Navigation, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type WorkerBookingRequest = {
  id: string;
  status: string;
  notified_at: string;
  instant_bookings?: {
    id: string;
    service_type: string;
    status: string;
    eta_minutes?: number | null;
    created_at: string;
  } | {
    id: string;
    service_type: string;
    status: string;
    eta_minutes?: number | null;
    created_at: string;
  }[] | null;
};

const activeStatuses = ["requested", "accepted", "on_the_way", "arrived"];

export function WorkerBookingRequests() {
  const [requests, setRequests] = useState<WorkerBookingRequest[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const latestPending = requests.find((request) => {
    const booking = Array.isArray(request.instant_bookings) ? request.instant_bookings[0] : request.instant_bookings;
    return request.status === "pending" && booking?.status === "requested";
  });

  async function authHeaders(): Promise<Record<string, string>> {
    const session = isSupabaseConfigured() ? (await createClient().auth.getSession()).data.session : null;
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
  }

  const loadRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/radar/worker-requests", {
        cache: "no-store",
        headers: await authHeaders()
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(payload.error ?? "Booking requests load nahi hue.");
        return;
      }
      setRequests(Array.isArray(payload.data) ? payload.data : []);
    } catch {
      setStatus("Network issue. Requests refresh nahi hue.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function updateRequest(id: string, action: "accept" | "reject" | "on_the_way" | "arrived" | "completed") {
    setStatus(action === "accept" ? "Accepting booking..." : "Updating booking...");
    try {
      const response = await fetch(`/api/radar/worker-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeaders())
        },
        body: JSON.stringify({ action })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(payload.error ?? "Booking update failed.");
        return;
      }
      setStatus(action === "accept" ? "Booking accepted. Customer ko status update dikhega." : "Booking updated.");
      await loadRequests();
    } catch {
      setStatus("Network issue. Action complete nahi hua.");
    }
  }

  useEffect(() => {
    loadRequests();
    const interval = window.setInterval(loadRequests, 10000);
    return () => window.clearInterval(interval);
  }, [loadRequests]);

  return (
    <>
    {latestPending ? (
      <div className="fixed inset-x-3 top-24 z-50 mx-auto max-w-md rounded-3xl border border-saffron/30 bg-white p-4 shadow-2xl dark:bg-zinc-950">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-saffron">New Instant Booking</p>
        <p className="mt-1 text-lg font-black">{(Array.isArray(latestPending.instant_bookings) ? latestPending.instant_bookings[0] : latestPending.instant_bookings)?.service_type ?? "Service"} request aaya hai</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => updateRequest(latestPending.id, "accept")} className="rounded-2xl bg-mint px-4 py-3 text-sm font-black text-white">Accept</button>
          <button onClick={() => updateRequest(latestPending.id, "reject")} className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 dark:bg-red-500/10">Reject</button>
        </div>
      </div>
    ) : null}
    <div id="booking-requests" className="scroll-mt-28 glass rounded-[2rem] p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Instant Booking Requests</h2>
          <p className="text-sm font-semibold text-zinc-500">Customer request yahin aayega. Accept karne ke baad hi booking lock hogi.</p>
        </div>
        <Clock className="h-5 w-5 text-saffron" />
      </div>

      {status ? <p className="mb-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">{status}</p> : null}

      <div className="grid gap-3">
        {requests.map((request) => {
          const booking = Array.isArray(request.instant_bookings) ? request.instant_bookings[0] : request.instant_bookings;
          const bookingStatus = booking?.status ?? "requested";
          const canAccept = request.status === "pending" && bookingStatus === "requested";
          const canMove = request.status === "accepted" && activeStatuses.includes(bookingStatus);

          return (
            <article key={request.id} className="rounded-3xl bg-white p-4 shadow-sm dark:bg-zinc-950">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-black">{booking?.service_type ?? "Service request"}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Request: {request.status} • Booking: {bookingStatus.replaceAll("_", " ")}</p>
                </div>
                <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-black text-amber-700 dark:text-amber-200">
                  {new Date(request.notified_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {canAccept ? (
                  <>
                    <button onClick={() => updateRequest(request.id, "accept")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-mint px-4 py-3 text-sm font-black text-white">
                      <CheckCircle2 className="h-4 w-4" /> Accept
                    </button>
                    <button onClick={() => updateRequest(request.id, "reject")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 dark:bg-red-500/10">
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </>
                ) : null}

                {canMove && bookingStatus === "accepted" ? (
                  <button onClick={() => updateRequest(request.id, "on_the_way")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-ink">
                    <Navigation className="h-4 w-4" /> On The Way
                  </button>
                ) : null}
                {canMove && bookingStatus === "on_the_way" ? (
                  <button onClick={() => updateRequest(request.id, "arrived")} className="rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-ink">Arrived</button>
                ) : null}
                {canMove && bookingStatus === "arrived" ? (
                  <button onClick={() => updateRequest(request.id, "completed")} className="rounded-2xl bg-mint px-4 py-3 text-sm font-black text-white">Completed</button>
                ) : null}
              </div>
            </article>
          );
        })}

        {!requests.length ? (
          <p className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-500 dark:bg-zinc-950/60">
            {loading ? "Requests load ho rahe hain..." : "Abhi koi instant booking request nahi hai."}
          </p>
        ) : null}
      </div>
    </div>
    </>
  );
}
