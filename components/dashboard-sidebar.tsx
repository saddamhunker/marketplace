import Link from "next/link";
import { BadgeIndianRupee, BarChart3, Bell, Gift, Settings, ShieldCheck, UserRound } from "lucide-react";

const items = [
  { label: "Overview", href: "#overview", icon: BarChart3 },
  { label: "Profile", href: "#profile", icon: UserRound },
  { label: "Rewards", href: "#rewards", icon: Gift },
  { label: "Listings", href: "#listings", icon: BadgeIndianRupee },
  { label: "Alerts", href: "#alerts", icon: Bell },
  { label: "Verification", href: "#verification", icon: ShieldCheck },
  { label: "Settings", href: "#settings", icon: Settings }
];

export function DashboardSidebar() {
  return (
    <aside className="glass rounded-3xl p-3 lg:sticky lg:top-24 lg:h-fit">
      <div className="mb-3 rounded-2xl bg-gradient-to-br from-ink to-jamun p-4 text-white">
        <p className="text-sm font-bold opacity-80">Worker Level</p>
        <p className="text-2xl font-black">Gold</p>
        <p className="mt-1 text-xs opacity-80">148 boost points left</p>
      </div>
      <div className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={`/dashboard${item.href}`} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-100 focus:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800">
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
