import { ok, serviceUnavailable } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase } = await getApiUser();

  if (!supabase) {
    return ok([], { headers: { "x-mistrihub-fallback": "supabase-not-configured" } });
  }

  const { data, error } = await supabase
    .from("worker_live_locations")
    .select("*, worker_profiles(id, skill, profiles(full_name, phone, whatsapp))")
    .eq("is_online", true)
    .order("last_seen_at", { ascending: false });

  if (error) {
    return ok([], { headers: { "x-mistrihub-fallback": "radar-db-error" } });
  }

  return ok(data ?? []);
}

export async function POST() {
  return serviceUnavailable("Use /api/radar/worker-status to update worker location and online status.");
}
