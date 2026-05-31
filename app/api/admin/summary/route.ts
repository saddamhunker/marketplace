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

  const [profiles, workers, listings, reports] = await Promise.all([
    context.supabase.from("profiles").select("id", { count: "exact", head: true }),
    context.supabase.from("worker_profiles").select("id", { count: "exact", head: true }),
    context.supabase.from("listings").select("id", { count: "exact", head: true }),
    context.supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open")
  ]);

  const error = profiles.error ?? workers.error ?? listings.error ?? reports.error;

  if (error) {
    return serverError(error.message);
  }

  return ok({
    users: profiles.count ?? 0,
    workers: workers.count ?? 0,
    listings: listings.count ?? 0,
    openReports: reports.count ?? 0
  });
}
