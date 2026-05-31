import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase } = await getApiUser();
  if (!supabase) return serviceUnavailable();
  const { data, error } = await supabase
    .from("listings")
    .select("*, profiles(full_name, phone, whatsapp)")
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
    .from("listings")
    .insert({
      owner_id: user.id,
      type: body.type,
      title: body.title,
      category: body.category,
      description: body.description ?? null,
      price: body.price ?? null,
      price_label: body.priceLabel ?? null,
      location: body.location,
      images: body.images ?? []
    })
    .select()
    .single();

  if (error) {
    return serverError(error.message);
  }

  return created(data);
}
