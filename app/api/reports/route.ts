import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase, profile } = await getApiUser();
  if (!supabase) return serviceUnavailable();

  if (!profile) {
    return unauthorized();
  }

  const query = supabase.from("reports").select("*").order("created_at", { ascending: false });
  const { data, error } = profile.role === "admin" ? await query : await query.eq("reporter_id", profile.id);

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
    .from("reports")
    .insert({
      reporter_id: user.id,
      reported_profile_id: body.reportedProfileId ?? null,
      listing_id: body.listingId ?? null,
      business_profile_id: body.businessProfileId ?? null,
      reason: body.reason
    })
    .select()
    .single();

  if (error) {
    return serverError(error.message);
  }

  return created(data);
}
