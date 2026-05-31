import Link from "next/link";
import { BadgeCheck, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="section-pad border-t border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="container-wide grid gap-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-saffron to-jamun text-white"><BadgeCheck className="h-6 w-6" /></span>
            <div>
              <p className="text-xl font-black">MistriHub Market</p>
              <p className="text-sm font-bold text-zinc-500">Trusted People Nearby.</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            India’s trusted hyperlocal platform for workers, products, urgent jobs, reels, ratings, and verified local commerce.
          </p>
          <div className="mt-5 flex gap-2 text-zinc-500">
            {[Instagram, Facebook, Twitter, Linkedin].map((Icon, index) => (
              <span key={index} className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-100 dark:bg-zinc-900"><Icon className="h-4 w-4" /></span>
            ))}
          </div>
        </div>
        {[
          { title: "Explore", items: [["Workers", "/workers"], ["Live Radar", "/radar"], ["Marketplace", "/marketplace"], ["Nearby Places", "/nearby-places"], ["Post a Job", "/post-job"], ["Post Product", "/post-product"]] },
          { title: "Trust", items: [["Get Verified", "/dashboard"], ["Leaderboard", "/workers"], ["Report Scam", "/report"], ["Reviews", "/#reviews"]] },
          { title: "Account", items: [["Login", "/login"], ["Join as Worker", "/login"], ["Dashboard", "/dashboard"], ["Admin Panel", "/admin"]] }
        ].map((group) => (
          <div key={group.title}>
            <p className="mb-3 font-black">{group.title}</p>
            <div className="grid gap-2">
              {group.items.map(([label, href]) => (
                <Link key={href} href={href} className="text-sm font-semibold text-zinc-600 hover:text-saffron dark:text-zinc-300">{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
