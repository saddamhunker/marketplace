import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase } = await getApiUser();
  if (!supabase) return serviceUnavailable();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return serverError(error.message);
  }

  return ok(data);
}

export async function POST(request: Request) {
  const { supabase, user } = await getApiUser();
  if (!supabase) return serviceUnavailable();

  if (!user) {
    return unauthorized();
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      reviewer_id: user.id,
      worker_profile_id: body.workerProfileId ?? null,
      business_profile_id: body.businessProfileId ?? null,
      listing_id: body.listingId ?? null,
      rating: body.rating,
      comment: body.comment ?? null
    })
    .select()
    .single();

  if (error) {
    return serverError(error.message);
  }

  return created(data);
}
