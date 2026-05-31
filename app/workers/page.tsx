import { Filter, MapPin } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { SectionHeader, WorkerCard } from "@/components/ui";
import { workers } from "@/lib/data";

export const metadata = { title: "Worker Listing" };

export default function WorkersPage() {
  return (
    <section className="section-pad">
      <div className="container-wide">
        <SectionHeader eyebrow="Workers" title="Find Verified Workers Nearby" description="Search by location, category, price, rating, availability, and trust score." />
        <SearchBar compact />
        <div className="my-6 flex flex-wrap gap-3">
          {["Location: Near me", "Category", "Price", "Rating 4+", "Available Now", "Elite/Gold"].map((filter) => (
            <button key={filter} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-bold dark:border-zinc-800 dark:bg-zinc-900">
              <Filter className="h-4 w-4" />
              {filter}
            </button>
          ))}
        </div>
        <div className="mb-5 flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">
          <MapPin className="h-4 w-4 text-mint" />
          Showing 20 trusted profiles around your city
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workers.map((worker) => <WorkerCard key={worker.id} worker={worker} featured={worker.trustScore > 92} />)}
        </div>
      </div>
    </section>
  );
}
