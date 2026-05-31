import { Radio } from "lucide-react";
import { liveFeed } from "@/lib/data";

export function LiveFeed() {
  const scrollingItems = [...liveFeed, ...liveFeed];

  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-black"><Radio className="h-5 w-5 text-red-500" /> Live Activity</h3>
        <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600 dark:bg-red-500/15">
          <span className="pulse-dot h-2 w-2 rounded-full bg-red-500" />
          LIVE
        </span>
      </div>
      <div className="relative h-72 overflow-hidden rounded-3xl bg-zinc-50 p-3 dark:bg-zinc-950/60">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-zinc-50 to-transparent dark:from-zinc-950" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-950" />
        <div className="live-scroll grid gap-3">
          {scrollingItems.map((item, index) => (
            <div key={`${item}-${index}`} className="rounded-2xl border border-zinc-100 bg-white p-3 text-sm font-bold shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-mint" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
