import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { user, profile } = await getApiUser();

  if (!user) {
    return unauthorized();
  }

  return ok({ user, profile });
}

export async function POST(request: Request) {
  const { supabase, user } = await getApiUser();
  if (!supabase) return serviceUnavailable();

  if (!user) {
    return unauthorized();
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: body.fullName ?? user.email ?? "MistriHub User",
      phone: body.phone ?? null,
      whatsapp: body.whatsapp ?? null,
      city: body.city ?? null,
      area: body.area ?? null,
      role: body.role ?? "user",
      referral_code: body.referralCode ?? null
    })
    .select()
    .single();

  if (error) {
    return serverError(error.message);
  }

  return created(data);
}
