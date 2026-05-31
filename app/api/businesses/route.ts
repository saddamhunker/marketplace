import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase } = await getApiUser();
  if (!supabase) return serviceUnavailable();
  const { data, error } = await supabase
    .from("business_profiles")
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
    .from("business_profiles")
    .insert({
      owner_id: user.id,
      name: body.name,
      category: body.category,
      location: body.location,
      distance_label: body.distanceLabel ?? null,
      opens_at: body.opensAt ?? null,
      closes_at: body.closesAt ?? null,
      phone: body.phone ?? null,
      whatsapp: body.whatsapp ?? null,
      photos: body.photos ?? [],
      offer: body.offer ?? null
    })
    .select()
    .single();

  if (error) {
    return serverError(error.message);
  }

  return created(data);
}
