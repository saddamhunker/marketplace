"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { AuthStatus } from "@/components/auth/auth-status";
import { NotificationMenu } from "@/components/notification-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/workers", label: "Workers" },
  { href: "/radar", label: "Radar" },
  { href: "/marketplace", label: "Market" },
  { href: "/nearby-places", label: "Places" },
  { href: "/post-job", label: "Post Work" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/78 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/78">
      <nav className="container-wide flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-saffron via-rose-500 to-jamun text-white shadow-lg">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-lg font-black leading-5">MistriHub Market</span>
            <span className="text-xs font-bold text-zinc-500">Kaam Bhi. Market Bhi.</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 hover:text-ink dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <NotificationMenu />
          <ThemeToggle />
          <AuthStatus />
          <button onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-2xl bg-zinc-100 xl:hidden dark:bg-zinc-900" aria-label="Open menu" aria-expanded={open}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
      {open ? (
        <div className="container-wide px-4 pb-4 sm:px-6 lg:px-8 xl:hidden">
          <div className="grid gap-2 rounded-3xl border border-zinc-100 bg-white p-3 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-black text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
