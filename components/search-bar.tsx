import { MapPin, Search, SlidersHorizontal } from "lucide-react";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  return (
    <form className={`glass flex w-full flex-col gap-3 rounded-[2rem] p-3 sm:flex-row sm:items-center ${compact ? "" : "max-w-4xl"}`}>
      <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 dark:bg-zinc-950">
        <Search className="h-5 w-5 text-saffron" />
        <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-zinc-400" placeholder="What do you need today?" />
      </label>
      <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 dark:bg-zinc-950 sm:w-56">
        <MapPin className="h-5 w-5 text-mint" />
        <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-zinc-400" placeholder="Your area" />
      </label>
      <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-3 text-sm font-black text-white transition hover:bg-saffron dark:bg-white dark:text-ink">
        <SlidersHorizontal className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}
