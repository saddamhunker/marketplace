import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export async function GET(request: Request) {
  const { user, profile } = await getApiUser(request);

  if (!user) {
    return unauthorized();
  }

  return ok({ user, profile });
}

export async function POST(request: Request) {
  const { supabase, user } = await getApiUser(request);
  if (!supabase) return serviceUnavailable();

  if (!user) {
    return unauthorized();
  }

  const body = await request.json();
  try {
    const profile = await ensureProfile(user, {
      fullName: body.fullName,
      role: body.role,
      phone: body.phone,
      whatsapp: body.whatsapp,
      city: body.city,
      area: body.area
    });

    return created(profile);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Profile setup failed");
  }
}
