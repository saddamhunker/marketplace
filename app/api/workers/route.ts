import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("worker_profiles")
      .select("*, profiles(full_name, phone, whatsapp), worker_live_locations(latitude, longitude, is_online, last_seen_at)")
      .order("created_at", { ascending: false });

    if (error) return serverError(error.message);

    return ok(data);
  } catch {
    const { supabase } = await getApiUser(request);
    if (!supabase) return serviceUnavailable();

    const { data, error } = await supabase
      .from("worker_profiles")
      .select("*, profiles(full_name, phone, whatsapp), worker_live_locations(latitude, longitude, is_online, last_seen_at)")
      .order("created_at", { ascending: false });

    if (error) return serverError(error.message);

    return ok(data);
  }
}

export async function POST(request: Request) {
  const { supabase, user } = await getApiUser(request);
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
