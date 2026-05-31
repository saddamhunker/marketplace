import { Crown } from "lucide-react";
import { Worker } from "@/lib/data";
import { LevelBadge, Rating, TrustBadge } from "@/components/ui";

export function Leaderboard({ workers }: { workers: Worker[] }) {
  return (
    <div className="glass rounded-3xl p-4">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-black"><Crown className="h-5 w-5 text-saffron" /> Top Workers</h3>
      <div className="space-y-3">
        {workers.map((worker, index) => (
          <div key={worker.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-zinc-950/70">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-sm font-black text-white dark:bg-white dark:text-ink">#{index + 1}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-black">{worker.name}</p>
              <p className="text-xs text-zinc-500">{worker.skill} • {worker.location}</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <LevelBadge level={worker.level} />
              <TrustBadge score={worker.trustScore} compact />
              <Rating value={worker.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
