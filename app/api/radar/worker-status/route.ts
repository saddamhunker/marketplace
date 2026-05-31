import { created, serviceUnavailable, unauthorized, serverError } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function POST(request: Request) {
  const { supabase, user } = await getApiUser();

  if (!supabase) return serviceUnavailable();
  if (!user) return unauthorized();

  const body = await request.json();
  const { data: workerProfile, error: workerError } = await supabase
    .from("worker_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (workerError || !workerProfile) {
    return unauthorized("Worker profile required");
  }

  const { data, error } = await supabase
    .from("worker_live_locations")
    .upsert({
      worker_profile_id: workerProfile.id,
      latitude: body.latitude,
      longitude: body.longitude,
      is_online: body.isOnline,
      update_interval_seconds: body.updateIntervalSeconds ?? 30,
      last_seen_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) return serverError(error.message);

  return created(data);
}
