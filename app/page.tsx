import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartPulse, MapPin, Play, Sparkles, Store, TicketPercent, Utensils, Zap } from "lucide-react";
import { CategoryGrid } from "@/components/category-grid";
import { Leaderboard } from "@/components/leaderboard";
import { LocationAwareBusinessGrid } from "@/components/location-aware-business-grid";
import { LiveFeed } from "@/components/live-feed";
import { ReviewCard } from "@/components/review-card";
import { SearchBar } from "@/components/search-bar";
import { ProductCard, SectionHeader, WorkerCard } from "@/components/ui";
import { byCategory, openBusinesses, shoppingBusinesses, trendingBusinesses } from "@/lib/business-selectors";
import { businesses, products, reviews, stats, trustFactors, workerCategories } from "@/lib/data";
import { getSupabaseWorkers } from "@/lib/workers-data";

const quickButtons = workerCategories.slice(0, 4).map((category) => `Need ${category.name} Now`);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const homeWorkers = await getSupabaseWorkers(8);
  const topWorkers = homeWorkers
    .filter((worker) => worker.level === "Elite" || worker.level === "Gold" || worker.trustScore >= 70)
    .slice(0, 5);
  const restaurants = byCategory(businesses, "Restaurants");
  const nearbyShops = shoppingBusinesses(businesses);
  const openNow = openBusinesses(businesses);
  const trendingPlaces = trendingBusinesses(businesses);

  return (
    <>
      <section className="section-pad overflow-hidden">
        <div className="container-wide grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="py-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-white/80 px-4 py-2 text-sm font-black text-saffron shadow-sm dark:bg-zinc-900">
              <Sparkles className="h-4 w-4" />
              Trusted People Nearby.
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-ink dark:text-white sm:text-6xl lg:text-7xl">
              Find Workers, Buy & Sell Nearby - Instantly
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              MistriHub Market brings verified workers, urgent jobs, local deals, reels, reviews, and trust scores into one fast hyperlocal app-style website.
            </p>
            <div className="mt-7">
              <SearchBar />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {["Find Worker Now", "Post Your Work", "Sell Your Item", "Join as Worker", "Get Verified"].map((label, index) => (
                <Link key={label} href={index === 2 ? "/post-product" : index === 1 ? "/post-job" : index >= 3 ? "/login" : "/workers"} className={`rounded-full px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 ${index === 0 ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-white text-ink dark:bg-zinc-900 dark:text-white"}`}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="glass rounded-[2rem] p-4">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-saffron via-rose-500 to-jamun p-5 text-white">
                <div className="mb-16 flex items-center justify-between">
                  <p className="text-sm font-bold opacity-85">Local pulse</p>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">LIVE</span>
                </div>
                <h2 className="text-3xl font-black">Kaam Bhi. Market Bhi.</h2>
                <p className="mt-2 text-sm leading-6 opacity-90">Verified workers, safe deals, and urgent help within your area.</p>
              </div>
              <div className="-mt-10 grid gap-3 px-2 sm:grid-cols-2">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-3xl bg-white p-4 shadow-lg dark:bg-zinc-950">
                      <Icon className="mb-3 h-5 w-5 text-saffron" />
                      <p className="text-2xl font-black">{stat.value}</p>
                      <p className="text-xs font-semibold text-zinc-500">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-wide">
          <SectionHeader title="Browse Categories" description="Quick picks for common services and local marketplace needs." />
          <CategoryGrid />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <LiveFeed />
          <div className="glass rounded-3xl p-4">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black"><HeartPulse className="h-5 w-5 text-red-500" /> Emergency Quick Help</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickButtons.map((button) => (
                <Link key={button} href="/post-job" className="flex items-center justify-between rounded-2xl bg-white p-4 font-black shadow-sm transition hover:-translate-y-1 dark:bg-zinc-950">
                  {button}
                  <Zap className="h-5 w-5 text-saffron" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeader eyebrow="Nearby" title="Workers Ready Around You" description="Verified local professionals with ratings, level badges, response time, and direct contact." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {homeWorkers.map((worker, index) => <WorkerCard key={worker.id} worker={worker} featured={index < 3} />)}
          </div>
          {!homeWorkers.length ? <p className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">Supabase workers abhi load nahi hue.</p> : null}
          <BottomSectionLink href="/workers" label="View all workers" />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeader eyebrow="Market" title="Nearby Marketplace Deals" description="Buy and sell bikes, mobiles, furniture, property, appliances, and tools with seller trust scores." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <BottomSectionLink href="/marketplace" label="Explore marketplace" />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeader eyebrow="Places" title="Nearby Restaurants" description="Verified food spots with photos, reviews, offers, timings, directions, and quick WhatsApp." />
          <LocationAwareBusinessGrid businesses={restaurants} limit={4} />
          <BottomSectionLink href="/nearby-places" label="Explore nearby places" />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeader title="Nearby Shops" description="Daily-use shops, grocery, medical, hardware, electronics, and repair counters around your location." />
          <LocationAwareBusinessGrid businesses={nearbyShops} limit={4} />
          <BottomSectionLink href="/nearby-places" label="View shops" />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-[2rem] p-5 lg:col-span-2">
            <SectionHeader eyebrow="Offers" title="Today's Local Offers" description="Deals from nearby restaurants, clinics, grocery stores, garages, salons, and hotels." />
            <div className="grid gap-3 sm:grid-cols-2">
              {businesses.slice(0, 8).map((business) => (
                <div key={business.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-zinc-950">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-saffron/10 text-saffron">
                    <TicketPercent className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-black">{business.offer}</p>
                    <p className="text-xs text-zinc-500">{business.name} • {business.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-[2rem] p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black"><Store className="h-5 w-5 text-mint" /> Open Now Businesses</h3>
            <div className="space-y-3">
              {openNow.slice(0, 6).map((business) => (
                <div key={business.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 dark:bg-zinc-950">
                  <div className="min-w-0">
                    <p className="truncate font-black">{business.name}</p>
                    <p className="text-xs text-zinc-500">{business.category} • closes {business.closes}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">Open</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader title="Trending In Your Area" description="Fast moving services, product listings, and local activity signals." />
            <div className="grid gap-3 sm:grid-cols-2">
              {["AC service demand up 38%", "Used bikes selling fastest", "Painter bookings rising", "Mobile repair reels trending"].map((item) => (
                <div key={item} className="glass flex items-center gap-4 rounded-3xl p-5">
                  <MapPin className="h-5 w-5 text-mint" />
                  <p className="font-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <Leaderboard workers={topWorkers} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeader title="Trending Places Near You" description="Local places people are viewing, saving, calling, and visiting today." />
          <LocationAwareBusinessGrid businesses={trendingPlaces} limit={4} compact />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Restaurants trending after 7 PM", "Medical stores open late", "Mobile repair shops getting calls", "Clinics with weekend offers"].map((item) => (
              <div key={item} className="glass flex items-center gap-3 rounded-3xl p-4">
                <Utensils className="h-5 w-5 text-saffron" />
                <p className="text-sm font-black">{item}</p>
              </div>
            ))}
          </div>
          <BottomSectionLink href="/nearby-places" label="See all places" />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeader eyebrow="Reels" title="Short Service Videos" description="Local workers can post bite-sized proof videos: before/after, repair tips, shop demos, and completed jobs." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Fan repair in 15 min", "Wall texture finish", "Bike chain service", "Sofa deep clean"].map((title, index) => (
              <div key={title} className="group relative aspect-[9/14] overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-700 to-saffron p-4 text-white shadow-soft">
                <button className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/20 backdrop-blur"><Play className="h-6 w-6 fill-white" /></button>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold opacity-80">#{index + 1} near you</p>
                  <p className="text-lg font-black">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader eyebrow="Trust Score" title="Know Who You Are Hiring" description="Every profile combines verification and behavior signals, so trust is visible before you call." />
            <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl bg-mint px-5 py-3 text-sm font-black text-white">Get Verified <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trustFactors.map((factor) => {
              const Icon = factor.icon;
              return (
                <div key={factor.label} className="glass rounded-3xl p-5">
                  <Icon className="mb-4 h-6 w-6 text-saffron" />
                  <p className="font-black">{factor.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="reviews" className="section-pad">
        <div className="container-wide">
          <SectionHeader title="People Already Trust MistriHub" description="Reviews and ratings make local hiring and selling feel safer." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {reviews.slice(0, 5).map((review) => <ReviewCard key={review.name} review={review} />)}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide rounded-[2rem] bg-ink p-6 text-white shadow-soft dark:bg-white dark:text-ink sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <BadgeCheck className="mb-4 h-8 w-8 text-saffron" />
              <h2 className="text-3xl font-black sm:text-4xl">One platform for kaam, market, trust, and growth.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 opacity-80">Daily login streaks, referral points, profile boosts, worker levels, and featured listings keep users and workers engaged while staying professional.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Daily streak rewards", "Referral points", "Profile boost points", "Featured local listings"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 font-black dark:bg-ink/10">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function BottomSectionLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-5 flex justify-center">
      <Link href={href} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-saffron dark:bg-white dark:text-ink">
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
