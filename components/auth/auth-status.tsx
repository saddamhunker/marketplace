"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { AppRole } from "@/lib/supabase/database.types";

type ProfileResponse = {
  data?: {
    user?: { email?: string };
    profile?: {
      role: AppRole;
      full_name: string;
    } | null;
  };
};

type ProfileData = NonNullable<ProfileResponse["data"]>["profile"];
type UserFallback = {
  email?: string;
  full_name?: string;
  role?: AppRole;
};

export function AuthStatus() {
  const [profile, setProfile] = useState<ProfileData>(null);
  const [fallbackUser, setFallbackUser] = useState<UserFallback | null>(null);
  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const configured = isSupabaseConfigured();

  const loadProfile = useCallback(async () => {
    if (!configured) return;

    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const headers = sessionData.session?.access_token ? { Authorization: `Bearer ${sessionData.session.access_token}` } : undefined;
    const response = await fetch("/api/profile", { cache: "no-store", headers }).catch(() => null);

    if (!response?.ok) {
      const { data } = await supabase.auth.getUser();
      setProfile(null);
      setEmail(data.user?.email);
      setFallbackUser(data.user ? {
        email: data.user.email,
        full_name: String(data.user.user_metadata?.full_name ?? data.user.email ?? "MistriHub User"),
        role: (data.user.user_metadata?.role as AppRole) ?? "user"
      } : null);
      setLoading(false);
      return;
    }

    const payload = await response.json() as ProfileResponse;
    setProfile(payload.data?.profile ?? null);
    setEmail(payload.data?.user?.email);
    setFallbackUser(null);
    setLoading(false);
  }, [configured]);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    loadProfile();

    const { data } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [configured, loadProfile]);

  const activeName = profile?.full_name ?? fallbackUser?.full_name ?? email ?? "MistriHub User";
  const activeRole = profile?.role ?? fallbackUser?.role ?? "user";

  const initials = useMemo(() => {
    const source = activeName || "MH";
    return source
      .split(/[ @.]/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [activeName]);

  async function signOut() {
    if (configured) {
      await createClient().auth.signOut();
    }

    window.location.href = "/";
  }

  if (loading) {
    return <span className="hidden rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-black text-zinc-500 sm:inline-flex dark:bg-zinc-900">Checking...</span>;
  }

  if (!profile && !fallbackUser) {
    return (
      <Link href="/login" className="inline-flex rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white transition hover:bg-saffron dark:bg-white dark:text-ink">
        Login
      </Link>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-2xl bg-white px-2 py-2 shadow-sm dark:bg-zinc-900" aria-label="Account menu" aria-expanded={open}>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-saffron to-jamun text-xs font-black text-white">{initials}</span>
        <span className="hidden text-left lg:block">
          <span className="block max-w-28 truncate text-sm font-black">{activeName}</span>
          <span className="flex items-center gap-1 text-[11px] font-bold capitalize text-mint"><ShieldCheck className="h-3 w-3" /> {activeRole}</span>
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 top-14 z-50 w-64 rounded-3xl border border-zinc-100 bg-white p-3 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-950">
            <p className="font-black">{activeName}</p>
            <p className="text-xs font-semibold text-zinc-500">{email}</p>
          </div>
          <Link href={activeRole === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="mt-2 flex items-center gap-2 rounded-2xl px-3 py-3 text-sm font-black hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <UserRound className="h-4 w-4" />
            {activeRole === "admin" ? "Admin Panel" : "My Dashboard"}
          </Link>
          <p className="mt-2 rounded-2xl bg-mint/10 px-3 py-2 text-xs font-black text-emerald-700 dark:text-emerald-200">
            Logged in as {activeRole}
          </p>
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm font-black text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
