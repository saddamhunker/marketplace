import { ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase, user } = await getApiUser();
  if (!supabase) return serviceUnavailable();

  if (!user) {
    return unauthorized();
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return serverError(error.message);
  }

  return ok(data);
}
