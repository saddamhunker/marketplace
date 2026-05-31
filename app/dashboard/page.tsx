import Link from "next/link";
import { BadgeCheck, Eye, Gift, Megaphone, Plus, Share2, TrendingUp } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Leaderboard } from "@/components/leaderboard";
import { WorkerOnlineToggle } from "@/components/radar/worker-online-toggle";
import { ProductCard, SectionHeader, WorkerCard } from "@/components/ui";
import { leaderboard, products, workers } from "@/lib/data";

export const metadata = { title: "Dashboard" };

const rewardCards = [
  { label: "Daily login streak", value: "7 days", icon: Gift },
  { label: "Referral points", value: "1,240", icon: Share2 },
  { label: "Profile boost points", value: "148", icon: TrendingUp },
  { label: "Views this week", value: "329", icon: Eye }
];

export default function DashboardPage() {
  return (
    <section className="section-pad">
      <div className="container-wide grid gap-6 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar />
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-ink via-zinc-800 to-jamun p-6 text-white shadow-soft">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-saffron">Dashboard</p>
                <h1 className="text-3xl font-black sm:text-5xl">Grow your kaam and market presence.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">Manage profile, work posts, product listings, rewards, referrals, alerts, and verification in one place.</p>
              </div>
              <Link href="/post-product" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-ink"><Plus className="h-4 w-4" /> New listing</Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {rewardCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="glass rounded-3xl p-5">
                  <Icon className="mb-4 h-6 w-6 text-saffron" />
                  <p className="text-3xl font-black">{card.value}</p>
                  <p className="text-sm font-bold text-zinc-500">{card.label}</p>
                </div>
              );
            })}
          </div>

          <WorkerOnlineToggle />

          <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <div className="glass rounded-[2rem] p-5">
              <SectionHeader title="Verification & Trust" description="Complete checks to unlock more calls and higher placement." />
              <div className="grid gap-3 sm:grid-cols-2">
                {["Phone Verified", "ID Verification Pending", "Add 3 job photos", "Ask for 5 reviews"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-zinc-950">
                    {index === 0 ? <BadgeCheck className="h-5 w-5 text-mint" /> : <Megaphone className="h-5 w-5 text-saffron" />}
                    <p className="font-black">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <Leaderboard workers={leaderboard} />
          </div>

          <div>
            <SectionHeader title="Your Worker Preview" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workers.slice(0, 3).map((worker) => <WorkerCard key={worker.id} worker={worker} featured />)}
            </div>
          </div>

          <div>
            <SectionHeader title="Your Product Listings" action={{ href: "/post-product", label: "Sell another item" }} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
