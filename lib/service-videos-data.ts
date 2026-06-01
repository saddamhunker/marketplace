import { createAdminClient } from "@/lib/supabase/admin";

export type ServiceVideo = {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  category: string;
  workerName: string;
  skill: string;
  verified: boolean;
};

type ServiceVideoRow = {
  id: string;
  title: string;
  description?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  category: string;
  worker_profiles?: {
    skill?: string | null;
    verification_status?: string | null;
    profiles?: { full_name?: string | null } | null;
  } | null;
};

export const fallbackServiceVideos: ServiceVideo[] = [
  { id: "fan-repair", title: "Fan repair in 15 min", videoUrl: "", category: "Electrician", workerName: "Verified Worker", skill: "Electrician", verified: true },
  { id: "wall-texture", title: "Wall texture finish", videoUrl: "", category: "Painter", workerName: "Verified Worker", skill: "Painter", verified: true },
  { id: "bike-chain", title: "Bike chain service", videoUrl: "", category: "Mechanic", workerName: "Verified Worker", skill: "Mechanic", verified: true },
  { id: "sofa-clean", title: "Sofa deep clean", videoUrl: "", category: "Carpenter", workerName: "Verified Worker", skill: "Carpenter", verified: true }
];

function mapServiceVideo(row: ServiceVideoRow): ServiceVideo {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    videoUrl: row.video_url,
    thumbnailUrl: row.thumbnail_url,
    category: row.category,
    workerName: row.worker_profiles?.profiles?.full_name ?? "MistriHub Worker",
    skill: row.worker_profiles?.skill ?? row.category,
    verified: row.worker_profiles?.verification_status === "verified"
  };
}

export async function getRecentServiceVideos(limit = 4): Promise<ServiceVideo[]> {
  try {
    const { data, error } = await createAdminClient()
      .from("service_videos")
      .select("id, title, description, video_url, thumbnail_url, category, worker_profiles(skill, verification_status, profiles(full_name))")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data?.length) return fallbackServiceVideos;

    return (data as ServiceVideoRow[]).map(mapServiceVideo);
  } catch {
    return fallbackServiceVideos;
  }
}
