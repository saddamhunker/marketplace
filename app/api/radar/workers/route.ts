import { ok, serviceUnavailable } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  let supabase;

  try {
    supabase = createAdminClient();
  } catch {
    const context = await getApiUser();
    supabase = context.supabase;
  }

  if (!supabase) {
    return ok([], { headers: { "x-mistrihub-fallback": "supabase-not-configured" } });
  }

  const { data, error } = await supabase
    .from("worker_profiles")
    .select("id, skill, availability, latitude, longitude, profiles(full_name, phone, whatsapp), worker_live_locations(latitude, longitude, is_online, last_seen_at)")
    .order("created_at", { ascending: false });

  if (error) {
    return ok([], { headers: { "x-mistrihub-fallback": "radar-db-error" } });
  }

  return ok(data ?? []);
}

export async function POST() {
  return serviceUnavailable("Use /api/radar/worker-status to update worker location and online status.");
}
