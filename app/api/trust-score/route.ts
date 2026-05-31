import { ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase, user } = await getApiUser();
  if (!supabase) return serviceUnavailable();

  if (!user) {
    return unauthorized();
  }

  const { data, error } = await supabase
    .from("trust_scores")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (error) {
    return serverError(error.message);
  }

  return ok(data);
}
