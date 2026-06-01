import { created, ok, serverError, serviceUnavailable, unauthorized } from "@/lib/api/response";
import { getApiUser } from "@/lib/api/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data, error } = await createAdminClient()
      .from("service_videos")
      .select("*, worker_profiles(skill, verification_status, profiles(full_name))")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) return serverError(error.message);
    return ok(data ?? []);
  } catch {
    return serviceUnavailable();
  }
}

export async function POST(request: Request) {
  const { supabase, user } = await getApiUser(request);
  if (!supabase) return serviceUnavailable();
  if (!user) return unauthorized();

  const body = await request.json();
  const { data: workerProfile, error: workerError } = await supabase
    .from("worker_profiles")
    .select("id, skill")
    .eq("profile_id", user.id)
    .single();

  if (workerError || !workerProfile) {
    return serverError("Worker profile banao, phir reel upload hoga.");
  }

  const { data, error } = await supabase
    .from("service_videos")
    .insert({
      worker_profile_id: workerProfile.id,
      title: body.title,
      description: body.description ?? null,
      category: body.category ?? workerProfile.skill,
      video_url: body.videoUrl,
      thumbnail_url: body.thumbnailUrl ?? null,
      status: "active"
    })
    .select()
    .single();

  if (error) return serverError(error.message);
  return created(data);
}
