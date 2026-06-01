"use client";

import { useState } from "react";
import { BadgeCheck, Ban, Download, Eye, MoreHorizontal, ShieldCheck, Sparkles } from "lucide-react";

type AdminRow = { name: string; type: string; status: string; score: string };

export function AdminTable({
  title,
  rows
}: {
  title: string;
  rows: AdminRow[];
}) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function runAction(action: string, row: AdminRow) {
    setOpenRow(null);
    setMessage(`${action} ready for ${row.name}. Admin API update hook can be connected next.`);
  }

  function exportRows() {
    setMessage(`${title} export ready with ${rows.length} rows.`);
  }

  return (
    <div className="glass overflow-visible rounded-3xl">
      <div className="flex items-center justify-between border-b border-zinc-100 p-5 dark:border-zinc-800">
        <h3 className="text-lg font-black">{title}</h3>
        <button onClick={exportRows} className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-bold dark:bg-zinc-800">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
      {message ? <p className="mx-5 mt-4 rounded-2xl bg-mint/10 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-200">{message}</p> : null}
      <div className="overflow-x-auto pb-24">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-950">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowKey = `${row.name}-${row.type}`;
              return (
                <tr key={rowKey} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-5 py-4 font-black">{row.name}</td>
                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">{row.type}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                      <BadgeCheck className="h-3 w-3" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold">{row.score}</td>
                  <td className="relative px-5 py-4">
                    <button
                      onClick={() => setOpenRow((current) => current === rowKey ? null : rowKey)}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                      aria-expanded={openRow === rowKey}
                      aria-label={`More actions for ${row.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openRow === rowKey ? (
                      <div className="absolute right-5 top-14 z-50 w-48 rounded-2xl border border-zinc-100 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                        {[
                          { label: "View details", icon: Eye },
                          { label: "Mark verified", icon: ShieldCheck },
                          { label: "Feature listing", icon: Sparkles },
                          { label: "Suspend", icon: Ban, danger: true }
                        ].map((action) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.label}
                              onClick={() => runAction(action.label, row)}
                              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-black transition hover:bg-zinc-100 dark:hover:bg-zinc-800 ${action.danger ? "text-red-600" : ""}`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
