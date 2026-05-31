import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase } = await getApiUser();
  if (!supabase) return serviceUnavailable();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select("*, profiles(full_name, phone, whatsapp), trust_scores(score)")
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
    .from("worker_profiles")
    .upsert({
      profile_id: user.id,
      skill: body.skill,
      experience_years: body.experienceYears ?? 0,
      price_min: body.priceMin ?? null,
      price_max: body.priceMax ?? null,
      location: body.location,
      bio: body.bio ?? null,
      availability: body.availability ?? "Available Now"
    })
    .select()
    .single();

  if (error) {
    return serverError(error.message);
  }

  return created(data);
}
