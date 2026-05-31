import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, BriefcaseBusiness, Clock, Flag, MessageCircle, Phone, ShieldCheck, Star } from "lucide-react";
import { ReviewCard } from "@/components/review-card";
import { LevelBadge, SectionHeader, StatusPill, TrustBadge, WorkerCard } from "@/components/ui";
import { reviews, trustFactors, workers } from "@/lib/data";

export function generateStaticParams() {
  return workers.map((worker) => ({ id: worker.id }));
}

type DetailParams = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: DetailParams }) {
  const { id } = await params;
  const worker = workers.find((item) => item.id === id);
  return { title: worker ? `${worker.name} - ${worker.skill}` : "Worker Profile" };
}

export default async function WorkerProfilePage({ params }: { params: DetailParams }) {
  const { id } = await params;
  const worker = workers.find((item) => item.id === id);
  if (!worker) notFound();
  const related = workers.filter((item) => item.skill === worker.skill && item.id !== worker.id).slice(0, 3);

  return (
    <section className="section-pad">
      <div className="container-wide grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="glass rounded-[2rem] p-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="grid h-28 w-28 place-items-center rounded-[2rem] bg-gradient-to-br from-saffron to-jamun text-4xl font-black text-white shadow-lg">
            {worker.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          </div>
          <h1 className="mt-5 text-3xl font-black">{worker.name}</h1>
          <p className="text-lg font-bold text-zinc-600 dark:text-zinc-300">{worker.skill}</p>
          <p className="mt-1 text-sm text-zinc-500">{worker.location} • {worker.distance}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill status={worker.availability} />
            <LevelBadge level={worker.level} />
            <TrustBadge score={worker.trustScore} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <a href={`tel:${worker.phone}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-ink"><Phone className="h-4 w-4" /> Call</a>
            <a href={`https://wa.me/${worker.whatsapp}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-mint px-4 py-3 text-sm font-black text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          </div>
          <Link href={`/report?type=worker&id=${worker.id}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 dark:bg-red-500/10"><Flag className="h-4 w-4" /> Report scam</Link>
        </aside>
        <div className="space-y-6">
          <div className="glass rounded-[2rem] p-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <Metric icon={Star} label="Rating" value={worker.rating.toFixed(1)} />
              <Metric icon={BriefcaseBusiness} label="Jobs" value={String(worker.jobsCompleted)} />
              <Metric icon={Clock} label="Response" value={worker.responseTime} />
              <Metric icon={ShieldCheck} label="Trust" value={`${worker.trustScore}/100`} />
            </div>
            <p className="mt-6 text-zinc-700 dark:text-zinc-200">{worker.about}</p>
            <p className="mt-4 text-xl font-black">{worker.priceRange}</p>
          </div>

          <div className="glass rounded-[2rem] p-6">
            <SectionHeader title="Trust Score Breakdown" description="Signals used to recommend this worker." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trustFactors.slice(0, 6).map((factor) => {
                const Icon = factor.icon;
                return <div key={factor.label} className="rounded-2xl bg-white p-4 font-black dark:bg-zinc-950"><Icon className="mb-3 h-5 w-5 text-mint" />{factor.label}</div>;
              })}
            </div>
          </div>

          <div>
            <SectionHeader title="Reviews & Ratings" />
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.slice(0, 4).map((review) => <ReviewCard key={review.name} review={review} />)}
            </div>
          </div>

          {related.length ? (
            <div>
              <SectionHeader title="Similar Workers" />
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((item) => <WorkerCard key={item.id} worker={item} />)}
              </div>
            </div>
          ) : (
            <Link href="/workers" className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white dark:bg-white dark:text-ink"><BadgeCheck className="h-4 w-4" /> Browse more workers</Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 dark:bg-zinc-950">
      <Icon className="mb-3 h-5 w-5 text-saffron" />
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold text-zinc-500">{label}</p>
    </div>
  );
}
