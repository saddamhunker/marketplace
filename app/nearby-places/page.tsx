import { Filter, Flame, MapPin, Search } from "lucide-react";
import { BusinessCard } from "@/components/business-card";
import { SectionHeader } from "@/components/ui";
import { openBusinesses, trendingBusinesses } from "@/lib/business-selectors";
import { businessCategories, businesses } from "@/lib/data";

export const metadata = { title: "Nearby Places" };

export default function NearbyPlacesPage() {
  const openNow = openBusinesses(businesses);
  const trending = trendingBusinesses(businesses);

  return (
    <section className="section-pad">
      <div className="container-wide">
        <div className="mb-8 grid gap-6 rounded-[2rem] bg-ink p-6 text-white shadow-soft dark:bg-white dark:text-ink lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-saffron">Nearby Places</p>
            <h1 className="text-4xl font-black sm:text-6xl">Discover trusted local places around you.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 opacity-80">
              Hotels, restaurants, shops, grocery stores, clinics, salons, garages, coaching centers, repair shops, and daily deals near your area.
            </p>
          </div>
          <form className="rounded-3xl bg-white/10 p-3 dark:bg-ink/10">
            <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink dark:bg-zinc-950 dark:text-white">
              <Search className="h-5 w-5 text-saffron" />
              <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-zinc-400" placeholder="Search hotel, restaurant, medical, salon..." />
            </label>
            <label className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink dark:bg-zinc-950 dark:text-white">
              <MapPin className="h-5 w-5 text-mint" />
              <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-zinc-400" placeholder="Your area or pincode" />
            </label>
          </form>
        </div>

        <SectionHeader title="Explore Business Categories" description="Quickly jump into daily-use places and local services." />
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {businessCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button key={category.name} className="glass flex items-center gap-3 rounded-2xl p-4 text-left transition hover:-translate-y-1 hover:shadow-xl">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${category.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-black">{category.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {["Open now", "Verified only", "Offers today", "Within 2 km", "Rating 4.5+", "Trending"].map((filter) => (
            <button key={filter} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-bold dark:border-zinc-800 dark:bg-zinc-900">
              <Filter className="h-4 w-4" />
              {filter}
            </button>
          ))}
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <SectionHeader eyebrow="Open Now" title="Businesses Ready Right Now" description="Fast access to places currently open around you." />
            <div className="grid gap-4 md:grid-cols-2">
              {openNow.slice(0, 6).map((business) => <BusinessCard key={business.id} business={business} />)}
            </div>
          </div>
          <div className="glass rounded-[2rem] p-5 lg:sticky lg:top-24 lg:h-fit">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black"><Flame className="h-5 w-5 text-saffron" /> Trending Near You</h2>
            <div className="space-y-3">
              {trending.slice(0, 7).map((business, index) => (
                <div key={business.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-zinc-950">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-sm font-black text-white dark:bg-white dark:text-ink">#{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black">{business.name}</p>
                    <p className="text-xs text-zinc-500">{business.category} • {business.distance}</p>
                  </div>
                  <span className="text-sm font-black text-saffron">{business.rating.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SectionHeader eyebrow="All Places" title="Hotels, Shops, Services & Deals" description="Every listing includes timings, photos, contact actions, reviews, trust score, directions, and report controls." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {businesses.map((business) => <BusinessCard key={business.id} business={business} />)}
        </div>
      </div>
    </section>
  );
}
