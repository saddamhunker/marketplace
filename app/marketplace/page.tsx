import { Filter, Flame } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ProductCard, SectionHeader } from "@/components/ui";
import { products } from "@/lib/data";

export const metadata = { title: "Buy/Sell Marketplace" };

export default function MarketplacePage() {
  return (
    <section className="section-pad">
      <div className="container-wide">
        <SectionHeader eyebrow="Marketplace" title="Buy & Sell Nearby" description="Local products with seller trust score, location, condition, and quick contact actions." />
        <SearchBar compact />
        <div className="my-6 flex flex-wrap gap-3">
          {["All categories", "Under Rs 10k", "Verified sellers", "Posted today", "Near 5km", "Best deals"].map((filter) => (
            <button key={filter} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-bold dark:border-zinc-800 dark:bg-zinc-900">
              <Filter className="h-4 w-4" />
              {filter}
            </button>
          ))}
        </div>
        <div className="mb-5 flex items-center gap-2 rounded-3xl bg-saffron/10 p-4 text-sm font-black text-saffron">
          <Flame className="h-5 w-5" />
          Bikes, mobiles, and furniture are trending in your area today.
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
