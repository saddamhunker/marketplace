import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET(request: Request) {
  const { supabase, user } = await getApiUser(request);

  if (!supabase) return serviceUnavailable();
  if (!user) return unauthorized();

  const { data, error } = await supabase
    .from("instant_bookings")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return serverError(error.message);

  return ok(data);
}

export async function POST(request: Request) {
  const { supabase, user } = await getApiUser(request);

  if (!supabase) return serviceUnavailable();
  if (!user) return unauthorized();

  const body = await request.json();
  const { data, error } = await supabase
    .from("instant_bookings")
    .insert({
      customer_id: user.id,
      service_type: body.serviceType,
      latitude: body.latitude,
      longitude: body.longitude,
      radius_km: body.radiusKm ?? 5,
      fallback_phone: body.fallbackPhone ?? null,
      fallback_whatsapp: body.fallbackWhatsapp ?? null
    })
    .select()
    .single();

  if (error) return serverError(error.message);

  return created({
    booking: data,
    notificationMode: "FCM first, WhatsApp/call fallback for urgent requests"
  });
}
