import { BadgeCheck, Play } from "lucide-react";
import type { ServiceVideo } from "@/lib/service-videos-data";

export function ServiceVideoCard({ video, index }: { video: ServiceVideo; index: number }) {
  return (
    <article className="group relative aspect-[9/14] overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-700 to-saffron text-white shadow-soft">
      {video.videoUrl ? (
        <video className="h-full w-full object-cover" controls muted playsInline preload="metadata" src={video.videoUrl} />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/20 backdrop-blur transition group-hover:scale-110">
        <Play className="h-6 w-6 fill-white" />
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4">
        <p className="text-xs font-bold opacity-80">#{index + 1} near you</p>
        <p className="text-lg font-black">{video.title}</p>
        <p className="mt-1 line-clamp-2 text-xs font-semibold opacity-80">{video.workerName} • {video.skill}</p>
        {video.verified ? (
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 text-xs font-black">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified worker
          </span>
        ) : null}
      </div>
    </article>
  );
}
