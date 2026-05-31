import { ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import type { BookingStatus, Database } from "@/lib/supabase/database.types";

const allowedStatuses: BookingStatus[] = ["accepted", "on_the_way", "arrived", "completed", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await getApiUser();
  const { id } = await params;

  if (!supabase) return serviceUnavailable();
  if (!user) return unauthorized();

  const body = await request.json();
  const status = body.status as BookingStatus;

  if (!allowedStatuses.includes(status)) {
    return serverError("Invalid booking status");
  }

  const patch: Database["public"]["Tables"]["instant_bookings"]["Update"] = { status };

  if (status === "accepted") {
    patch.worker_profile_id = body.workerProfileId ?? null;
    patch.accepted_at = new Date().toISOString();
    patch.locked_at = new Date().toISOString();
    patch.eta_minutes = body.etaMinutes ?? 12;
  }

  if (status === "completed") {
    patch.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("instant_bookings")
    .update(patch)
    .eq("id", id)
    .in("status", status === "accepted" ? ["requested"] : ["accepted", "on_the_way", "arrived"])
    .select()
    .single();

  if (error) return serverError(error.message);

  return ok(data);
}
