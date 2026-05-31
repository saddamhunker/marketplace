import { forbidden, ok, serverError, unauthorized } from "@/lib/api/response";
import { requireApiRole } from "@/lib/api/auth";

export async function GET() {
  const context = await requireApiRole(["admin"]);

  if (!context.user) {
    return unauthorized();
  }

  if (!context.allowed) {
    return forbidden();
  }

  const { data, error } = await context.supabase
    .from("profiles")
    .select("*, trust_scores(score), worker_profiles(id, skill, verification_status)")
    .order("created_at", { ascending: false });

  if (error) {
    return serverError(error.message);
  }

  return ok(data);
}
