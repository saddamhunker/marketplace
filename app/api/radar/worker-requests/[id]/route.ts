import { forbidden, ok, serverError, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import { createAdminClient } from "@/lib/supabase/admin";

type Action = "accept" | "reject" | "on_the_way" | "arrived" | "completed";
type RequestRow = {
  id: string;
  booking_id: string;
  worker_profile_id: string;
  status: string;
  worker_profiles?: { profile_id?: string | null } | { profile_id?: string | null }[] | null;
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await getApiUser(request);
  const { id } = await params;

  if (!user) return unauthorized();

  const body = await request.json();
  const action = body.action as Action;

  if (!["accept", "reject", "on_the_way", "arrived", "completed"].includes(action)) {
    return serverError("Invalid request action");
  }

  const admin = createAdminClient();
  const { data: requestRow, error: requestError } = await admin
    .from("booking_requests")
    .select("id, booking_id, worker_profile_id, status, worker_profiles(profile_id)")
    .eq("id", id)
    .single();

  if (requestError || !requestRow) return serverError(requestError?.message ?? "Booking request not found");
  const bookingRequest = requestRow as RequestRow;

  const ownerId = Array.isArray(bookingRequest.worker_profiles)
    ? bookingRequest.worker_profiles[0]?.profile_id
    : bookingRequest.worker_profiles?.profile_id;

  if (ownerId !== user.id) return forbidden();

  if (action === "reject") {
    const { data, error } = await admin
      .from("booking_requests")
      .update({ status: "rejected", responded_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "pending")
      .select()
      .single();

    if (error) return serverError(error.message);
    return ok(data);
  }

  if (action === "accept") {
    const now = new Date().toISOString();
    const { data: booking, error: bookingError } = await admin
      .from("instant_bookings")
      .update({
        status: "accepted",
        worker_profile_id: bookingRequest.worker_profile_id,
        accepted_at: now,
        locked_at: now,
        eta_minutes: body.etaMinutes ?? 12
      })
      .eq("id", bookingRequest.booking_id)
      .eq("status", "requested")
      .select()
      .single();

    if (bookingError || !booking) {
      await admin
        .from("booking_requests")
        .update({ status: "missed", responded_at: now })
        .eq("id", id);
      return serverError("Ye booking already kisi worker ne accept kar li.");
    }

    await admin
      .from("booking_requests")
      .update({ status: "accepted", responded_at: now })
      .eq("id", id);

    await admin
      .from("booking_requests")
      .update({ status: "closed", responded_at: now })
      .eq("booking_id", bookingRequest.booking_id)
      .neq("id", id)
      .eq("status", "pending");

    return ok(booking);
  }

  const nextStatus = action;
  const allowedPrevious = action === "on_the_way" ? "accepted" : action === "arrived" ? "on_the_way" : "arrived";
  const patch = {
    status: nextStatus,
    ...(action === "completed" ? { completed_at: new Date().toISOString() } : {})
  };

  const { data, error } = await admin
    .from("instant_bookings")
    .update(patch)
    .eq("id", bookingRequest.booking_id)
    .eq("worker_profile_id", bookingRequest.worker_profile_id)
    .eq("status", allowedPrevious)
    .select()
    .single();

  if (error) return serverError(error.message);

  return ok(data);
}
