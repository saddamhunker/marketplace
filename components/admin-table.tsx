"use client";

import { useState } from "react";
import { BadgeCheck, Ban, Download, Eye, MoreHorizontal, ShieldCheck, Sparkles, X } from "lucide-react";

type AdminRow = { name: string; type: string; status: string; score: string };

export function AdminTable({
  title,
  rows
}: {
  title: string;
  rows: AdminRow[];
}) {
  const [tableRows, setTableRows] = useState(rows);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<AdminRow | null>(null);
  const [message, setMessage] = useState("");

  function updateRow(row: AdminRow, patch: Partial<AdminRow>) {
    setTableRows((currentRows) => currentRows.map((item) => item.name === row.name && item.type === row.type ? { ...item, ...patch } : item));
  }

  function runAction(action: string, row: AdminRow) {
    setOpenRow(null);

    if (action === "View details") {
      setSelectedRow(row);
      setMessage("");
      return;
    }

    if (action === "Mark verified") {
      updateRow(row, { status: "Verified" });
      setMessage(`${row.name} marked as verified.`);
      return;
    }

    if (action === "Feature listing") {
      updateRow(row, { status: "Featured" });
      setMessage(`${row.name} added to featured list.`);
      return;
    }

    if (action === "Suspend") {
      updateRow(row, { status: "Suspended" });
      setMessage(`${row.name} suspended from public discovery.`);
    }
  }

  function exportRows() {
    setMessage(`${title} export ready with ${tableRows.length} rows.`);
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
            {tableRows.map((row) => {
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
      {selectedRow ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${selectedRow.name} details`}>
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-saffron">{title}</p>
                <h3 className="mt-1 text-2xl font-black">{selectedRow.name}</h3>
              </div>
              <button onClick={() => setSelectedRow(null)} className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-100 dark:bg-zinc-900" aria-label="Close details">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-bold uppercase text-zinc-500">Type</p>
                <p className="font-black">{selectedRow.type}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-bold uppercase text-zinc-500">Status</p>
                <p className="font-black">{selectedRow.status}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-bold uppercase text-zinc-500">Trust score</p>
                <p className="font-black">{selectedRow.score}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => { runAction("Mark verified", selectedRow); setSelectedRow(null); }} className="rounded-2xl bg-mint px-4 py-3 text-sm font-black text-white">Verify</button>
              <button onClick={() => { runAction("Suspend", selectedRow); setSelectedRow(null); }} className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 dark:bg-red-500/10">Suspend</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
