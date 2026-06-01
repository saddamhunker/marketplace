import { created, forbidden, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { supabase, user } = await getApiUser(request);

  if (!supabase) return serviceUnavailable();
  if (!user) return unauthorized();

  const { data, error } = await supabase
    .from("instant_bookings")
    .select("*, worker_profiles(id, skill, profiles(full_name, phone, whatsapp))")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return serverError(error.message);

  return ok(data);
}

export async function POST(request: Request) {
  const { supabase, user, profile } = await getApiUser(request);

  if (!supabase) return serviceUnavailable();
  if (!user) return unauthorized();
  if (profile?.role === "admin") return forbidden("Admin booking nahi karega. Admin panel se manage karo.");

  const body = await request.json();
  const admin = createAdminClient();
  const { data: ownWorkerProfile } = await admin
    .from("worker_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();
  const { data, error } = await admin
    .from("instant_bookings")
    .insert({
      customer_id: user.id,
      service_type: body.serviceType,
      latitude: body.latitude,
      longitude: body.longitude,
      radius_km: body.radiusKm ?? 5,
      fallback_phone: body.fallbackPhone ?? null,
      fallback_whatsapp: body.fallbackWhatsapp ?? null
    })
    .select()
    .single();

  if (error) return serverError(error.message);

  const candidateWorkerIds = Array.isArray(body.candidateWorkerIds)
    ? body.candidateWorkerIds.filter((id: unknown): id is string => typeof id === "string" && id.length > 0)
    : [];

  const workerIds = new Set<string>();

  if (candidateWorkerIds.length) {
    const { data: candidateWorkers } = await admin
      .from("worker_profiles")
      .select("id")
      .in("id", candidateWorkerIds)
      .limit(8);

    (candidateWorkers ?? []).forEach((worker) => {
      if (worker.id !== ownWorkerProfile?.id) workerIds.add(worker.id);
    });
  }

  const { data: matchingWorkers } = await admin
    .from("worker_profiles")
    .select("id")
    .eq("skill", body.serviceType)
    .eq("availability", "Available Now")
    .limit(8);

  (matchingWorkers ?? []).forEach((worker) => {
    if (worker.id !== ownWorkerProfile?.id) workerIds.add(worker.id);
  });

  const requestRows = Array.from(workerIds).map((workerProfileId) => ({
    booking_id: data.id,
    worker_profile_id: workerProfileId,
    status: "pending"
  }));

  if (requestRows.length) {
    await admin.from("booking_requests").upsert(requestRows, { onConflict: "booking_id,worker_profile_id" });
  }

  return created({
    booking: data,
    notifiedWorkers: requestRows.length,
    notificationMode: "FCM first, WhatsApp/call fallback for urgent requests"
  });
}
