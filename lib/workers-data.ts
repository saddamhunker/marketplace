import { createAdminClient } from "@/lib/supabase/admin";
import { mapWorkerProfile, type WorkerProfileRow } from "@/lib/worker-mapper";
import type { Worker } from "@/lib/data";

const workerSelect = "*, profiles(full_name, phone, whatsapp), worker_live_locations(latitude, longitude, is_online, last_seen_at)";

export async function getSupabaseWorkers(limit?: number): Promise<Worker[]> {
  try {
    let query = createAdminClient()
      .from("worker_profiles")
      .select(workerSelect)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return (data as WorkerProfileRow[]).map(mapWorkerProfile);
  } catch {
    return [];
  }
}

export async function getSupabaseWorkerById(id: string): Promise<Worker | null> {
  try {
    const { data, error } = await createAdminClient()
      .from("worker_profiles")
      .select(workerSelect)
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return mapWorkerProfile(data as WorkerProfileRow);
  } catch {
    return null;
  }
}
