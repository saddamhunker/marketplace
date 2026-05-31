import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";

export async function GET() {
  const { supabase, user } = await getApiUser();
  if (!supabase) return serviceUnavailable();

  if (!user) {
    return unauthorized();
  }

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .or(`referrer_id.eq.${user.id},referred_id.eq.${user.id}`)
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
    .from("referrals")
    .insert({
      referrer_id: user.id,
      referred_id: body.referredId,
      points_awarded: body.pointsAwarded ?? 100
    })
    .select()
    .single();

  if (error) {
    return serverError(error.message);
  }

  return created(data);
}
