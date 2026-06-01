import { Filter } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { SectionHeader } from "@/components/ui";
import { WorkersGrid } from "@/components/workers/workers-grid";

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
        <WorkersGrid />
      </div>
    </section>
  );
}
