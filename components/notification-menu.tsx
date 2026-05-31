"use client";

import { useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { notifications } from "@/lib/data";

export function NotificationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen((value) => !value)} className="focus-ring relative grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink shadow-sm dark:bg-zinc-900 dark:text-white" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
      </button>
      {open ? (
        <div className="absolute right-0 top-14 z-50 w-80 rounded-3xl border border-zinc-100 bg-white p-3 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <p className="px-2 py-2 text-sm font-black">Alerts</p>
          {notifications.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-mint" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{item}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
