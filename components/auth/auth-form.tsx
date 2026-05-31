"use client";

import { useState } from "react";
import { BadgeCheck, Lock, Phone, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { AppRole } from "@/lib/supabase/database.types";

const roles: { label: string; value: AppRole }[] = [
  { label: "User", value: "user" },
  { label: "Worker", value: "worker" },
  { label: "Admin", value: "admin" }
];

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AppRole>("user");
  const [message, setMessage] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!configured) {
      setMessage("Supabase env vars are missing. Add them in .env.local to enable auth.");
      return;
    }

    const supabase = createClient();
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role
              }
            }
          });

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "register" && result.data.user) {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, role })
      });
    }

    let nextRole = role;

    if (mode === "login") {
      const profileResponse = await fetch("/api/profile").catch(() => null);
      if (profileResponse?.ok) {
        const payload = await profileResponse.json();
        nextRole = payload?.data?.profile?.role ?? "user";
      }
    }

    window.location.href = nextRole === "admin" ? "/admin" : "/dashboard";
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-6 sm:p-8">
      <div className="mb-6 flex rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-950">
        <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${mode === "login" ? "bg-white shadow-sm dark:bg-zinc-800" : "text-zinc-500"}`}>
          Login
        </button>
        <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${mode === "register" ? "bg-white shadow-sm dark:bg-zinc-800" : "text-zinc-500"}`}>
          Register
        </button>
      </div>

      {mode === "register" ? (
        <label className="mb-4 grid gap-2 text-sm font-black">
          Full name
          <span className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <UserPlus className="h-4 w-4 text-mint" />
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" placeholder="Your name" required />
          </span>
        </label>
      ) : null}

      <label className="mb-4 grid gap-2 text-sm font-black">
        Email
        <span className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <Phone className="h-4 w-4 text-mint" />
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" placeholder="you@example.com" type="email" required />
        </span>
      </label>

      <label className="mb-4 grid gap-2 text-sm font-black">
        Password
        <span className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <Lock className="h-4 w-4 text-saffron" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" placeholder="Minimum 6 characters" type="password" required />
        </span>
      </label>

      {mode === "register" ? (
        <label className="mb-4 grid gap-2 text-sm font-black">
          Account type
          <select value={role} onChange={(event) => setRole(event.target.value as AppRole)} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-saffron dark:border-zinc-800 dark:bg-zinc-950">
            {roles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      ) : null}

      {message ? <p className="mb-4 rounded-2xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">{message}</p> : null}

      <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white dark:bg-white dark:text-ink">
        <UserPlus className="h-4 w-4" />
        Continue
      </button>
      <button type="button" onClick={() => { setMode("register"); setRole("worker"); }} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-mint px-5 py-4 text-sm font-black text-white">
        <BadgeCheck className="h-4 w-4" />
        Join as Worker
      </button>
    </form>
  );
}
