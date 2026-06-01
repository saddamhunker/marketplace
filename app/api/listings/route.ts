import { badRequest, created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return serverError(error.message);
    }

    return ok(data);
  } catch {
    const { supabase } = await getApiUser(request);
    if (!supabase) return serviceUnavailable();

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return serverError(error.message);
    }

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
  if (!["product", "job", "business"].includes(body.type)) {
    return badRequest("Valid listing type is required");
  }

  if (!body.title || !body.category || !body.location) {
    return badRequest("Title, category, and location are required");
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      type: body.type,
      title: String(body.title).trim(),
      category: String(body.category).trim(),
      description: body.description ?? null,
      price: body.price ?? null,
      price_label: body.priceLabel ?? null,
      location: String(body.location).trim(),
      images: Array.isArray(body.images) ? body.images.slice(0, 4) : []
    })
    .select()
    .single();

  if (error) {
    return serverError(error.message);
  }

  return created(data);
}
