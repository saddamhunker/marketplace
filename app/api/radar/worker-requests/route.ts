import { ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET(request: Request) {
  const { supabase, user } = await getApiUser(request);

  if (!supabase) return serviceUnavailable();
  if (!user) return unauthorized();

  const { data: workerProfile, error: workerError } = await supabase
    .from("worker_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (workerError || !workerProfile) {
    return ok([]);
  }

  const { data, error } = await supabase
    .from("booking_requests")
    .select("id, status, notified_at, responded_at, instant_bookings(id, service_type, latitude, longitude, radius_km, status, eta_minutes, created_at)")
    .eq("worker_profile_id", workerProfile.id)
    .order("notified_at", { ascending: false })
    .limit(10);

  if (error) return serverError(error.message);

  return ok(data ?? []);
}
