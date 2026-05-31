import Link from "next/link";
import { BriefcaseBusiness, Home, Radar, ShoppingBag, Store, UserRound } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/workers", label: "Workers", icon: BriefcaseBusiness },
  { href: "/radar", label: "Radar", icon: Radar },
  { href: "/marketplace", label: "Market", icon: ShoppingBag },
  { href: "/nearby-places", label: "Places", icon: Store },
  { href: "/dashboard", label: "Me", icon: UserRound }
];

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-[1.75rem] border border-white/70 bg-white/88 px-2 py-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/88 lg:hidden" aria-label="Mobile navigation">
      <div className="grid grid-cols-6 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-black text-zinc-500 transition hover:bg-zinc-100 hover:text-ink dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white">
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
