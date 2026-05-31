import Link from "next/link";
import { Clock, Flag, MapPinned, MessageCircle, Navigation, Phone, TicketPercent } from "lucide-react";
import type { Business } from "@/lib/data";
import { Rating, TrustBadge, TrustScoreBar, VerifiedBadge } from "@/components/ui";

export function BusinessCard({ business, compact = false }: { business: Business; compact?: boolean }) {
  return (
    <article className="premium-card animate-soft-pop">
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${business.imageTone}`}>
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-ink shadow">{business.category}</span>
          {business.verified ? <VerifiedBadge /> : null}
        </div>
        {business.openNow ? <span className="pulse-dot absolute right-4 top-4 h-4 w-4 rounded-full border-2 border-white bg-mint" /> : null}
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
          {business.photos.map((photo) => (
            <div key={photo} className="rounded-2xl bg-white/20 px-2 py-3 text-center text-[11px] font-black text-white backdrop-blur">
              {photo}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black">{business.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-zinc-500">
              <MapPinned className="h-3.5 w-3.5 text-mint" />
              {business.location} • {business.distance}
            </p>
          </div>
          <TrustBadge score={business.trustScore} compact />
        </div>
        <TrustScoreBar score={business.trustScore} />

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black ${business.openNow ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200" : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200"}`}>
            {business.openNow ? "Open Now" : "Closed"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <Clock className="h-3.5 w-3.5" />
            {business.opens} - {business.closes}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-950/60">
          <Rating value={business.rating} count={business.reviews} />
          <span className="inline-flex items-center gap-1 text-xs font-black text-saffron">
            <TicketPercent className="h-4 w-4" />
            {business.offer}
          </span>
        </div>

        {!compact ? (
          <div className="mt-4 grid grid-cols-4 gap-2">
            <a href={`tel:${business.phone}`} className="focus-ring inline-flex items-center justify-center rounded-2xl bg-zinc-100 p-3 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" aria-label="Call business"><Phone className="h-4 w-4" /></a>
            <a href={`https://wa.me/${business.whatsapp}`} className="focus-ring inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-mint to-emerald-500 p-3 text-white shadow-lg shadow-emerald-500/20" aria-label="WhatsApp business"><MessageCircle className="h-4 w-4" /></a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.location}`)}`} className="focus-ring inline-flex items-center justify-center rounded-2xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200" aria-label="Map directions"><Navigation className="h-4 w-4" /></a>
            <Link href={`/report?type=business&id=${business.id}`} className="focus-ring inline-flex items-center justify-center rounded-2xl bg-red-50 p-3 text-red-600 dark:bg-red-500/10" aria-label="Report business"><Flag className="h-4 w-4" /></Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
