import { ok, serverError, serviceUnavailable } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import { radarWorkers } from "@/lib/data";

export async function GET() {
  const { supabase } = await getApiUser();

  if (!supabase) {
    return ok(radarWorkers.filter((worker) => worker.online));
  }

  const { data, error } = await supabase
    .from("worker_live_locations")
    .select("*, worker_profiles(id, skill, profiles(full_name, phone, whatsapp), trust_scores(score))")
    .eq("is_online", true)
    .order("last_seen_at", { ascending: false });

  if (error) {
    return serverError(error.message);
  }

  return ok(data);
}

export async function POST() {
  return serviceUnavailable("Use /api/radar/worker-status to update worker location and online status.");
}
