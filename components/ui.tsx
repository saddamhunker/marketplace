import Link from "next/link";
import { ArrowRight, BadgeCheck, Flag, MessageCircle, Phone, ShieldCheck, Sparkles, Star } from "lucide-react";
import type { Product, Worker } from "@/lib/data";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-saffron">{eyebrow}</p> : null}
        <h2 className="text-2xl font-black tracking-tight text-ink dark:text-white sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="inline-flex items-center gap-2 text-sm font-bold text-jamun dark:text-violet-300">
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function TrustBadge({ score, compact = false }: { score: number; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mint/10 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-500/10 dark:bg-mint/20 dark:text-emerald-200">
      <ShieldCheck className="h-3.5 w-3.5" />
      {compact ? score : `Trust ${score}`}
    </span>
  );
}

export function VerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-mint to-emerald-500 px-3 py-1 text-xs font-black text-white shadow-sm">
      <BadgeCheck className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function TrustScoreBar({ score }: { score: number }) {
  return (
    <div className="mt-4 rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-950/60">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs font-black text-zinc-600 dark:text-zinc-300">
          <ShieldCheck className="h-3.5 w-3.5 text-mint" />
          Trust Score
        </span>
        <span className="text-xs font-black text-emerald-700 dark:text-emerald-200">{score}/100</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className="h-full rounded-full bg-gradient-to-r from-mint via-saffron to-jamun transition-all duration-700" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-bold text-zinc-700 dark:text-zinc-200">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      {value.toFixed(1)} {count ? <span className="font-medium text-zinc-500">({count})</span> : null}
    </span>
  );
}

export function StatusPill({ status }: { status: Worker["availability"] }) {
  const styles = {
    "Available Now": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    "Busy Today": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    Offline: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200"
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[status]}`}>{status}</span>;
}

export function LevelBadge({ level }: { level: Worker["level"] }) {
  const styles = {
    Bronze: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200",
    Silver: "bg-slate-100 text-slate-700 dark:bg-slate-400/15 dark:text-slate-200",
    Gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-200",
    Elite: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[level]}`}>{level}</span>;
}

export function WorkerCard({ worker, featured = false }: { worker: Worker; featured?: boolean }) {
  return (
    <article className="premium-card animate-soft-pop p-4">
      <div className="flex items-start gap-4">
        <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-saffron via-rose-500 to-jamun text-xl font-black text-white shadow-lg">
          {worker.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          {worker.availability === "Available Now" ? <span className="pulse-dot absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-mint" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-black">{worker.name}</h3>
            {featured ? <VerifiedBadge /> : null}
          </div>
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{worker.skill} • {worker.distance}</p>
          <p className="mt-1 text-xs text-zinc-500">{worker.location}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusPill status={worker.availability} />
        <LevelBadge level={worker.level} />
        <TrustBadge score={worker.trustScore} />
      </div>
      <TrustScoreBar score={worker.trustScore} />
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-zinc-50 p-3 text-center dark:bg-zinc-950/60">
        <div><p className="text-sm font-black">{worker.experience}</p><p className="text-[11px] text-zinc-500">Exp.</p></div>
        <div><p className="text-sm font-black">{worker.jobsCompleted}</p><p className="text-[11px] text-zinc-500">Jobs</p></div>
        <div><p className="text-sm font-black">{worker.responseTime}</p><p className="text-[11px] text-zinc-500">Reply</p></div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <Rating value={worker.rating} count={worker.reviews} />
          <p className="mt-1 text-sm font-black">{worker.priceRange}</p>
        </div>
        <Link href={`/workers/${worker.id}`} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-saffron dark:bg-white dark:text-ink">
          View
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <a href={`tel:${worker.phone}`} className="focus-ring inline-flex items-center justify-center rounded-2xl bg-zinc-100 p-3 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" aria-label="Call worker"><Phone className="h-4 w-4" /></a>
        <a href={`https://wa.me/${worker.whatsapp}`} className="focus-ring inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-mint to-emerald-500 p-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20" aria-label="WhatsApp worker"><MessageCircle className="h-4 w-4" /></a>
        <Link href={`/report?type=worker&id=${worker.id}`} className="focus-ring inline-flex items-center justify-center rounded-2xl bg-red-50 p-3 text-red-600 dark:bg-red-500/10" aria-label="Report scam"><Flag className="h-4 w-4" /></Link>
      </div>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="premium-card animate-soft-pop">
      <Link href={`/products/${product.id}`} className={`relative block aspect-[4/3] overflow-hidden bg-gradient-to-br ${product.imageTone}`}>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={product.title} className="absolute inset-0 h-full w-full object-cover" src={product.imageUrl} />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="flex h-full items-end justify-between p-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-ink shadow">{product.category}</span>
          <span className="rounded-full bg-ink/75 px-3 py-1 text-xs font-black text-white backdrop-blur"><Sparkles className="mr-1 inline h-3 w-3" />Deal</span>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-black">{product.title}</h3>
            <p className="mt-1 text-xs text-zinc-500">{product.location} • {product.posted}</p>
          </div>
          <TrustBadge score={product.sellerTrust} compact />
        </div>
        <TrustScoreBar score={product.sellerTrust} />
        <p className="mt-3 text-2xl font-black text-ink dark:text-white">{product.price}</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{product.condition} • Seller: {product.seller}</p>
        <div className="mt-4 flex gap-2">
          <Link href={`/products/${product.id}`} className="flex-1 rounded-2xl bg-ink px-4 py-3 text-center text-sm font-bold text-white dark:bg-white dark:text-ink">
            Details
          </Link>
          <Link href={`/products/${product.id}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-mint to-emerald-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20"><MessageCircle className="h-4 w-4" /> Contact</Link>
        </div>
      </div>
    </article>
  );
}
