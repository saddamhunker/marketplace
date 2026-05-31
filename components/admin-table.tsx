import { BadgeCheck, MoreHorizontal } from "lucide-react";

export function AdminTable({
  title,
  rows
}: {
  title: string;
  rows: { name: string; type: string; status: string; score: string }[];
}) {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-zinc-100 p-5 dark:border-zinc-800">
        <h3 className="text-lg font-black">{title}</h3>
        <button className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-bold dark:bg-zinc-800">Export</button>
      </div>
      <div className="overflow-x-auto">
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
            {rows.map((row) => (
              <tr key={`${row.name}-${row.type}`} className="border-t border-zinc-100 dark:border-zinc-800">
                <td className="px-5 py-4 font-black">{row.name}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">{row.type}</td>
                <td className="px-5 py-4"><span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"><BadgeCheck className="h-3 w-3" /> {row.status}</span></td>
                <td className="px-5 py-4 font-bold">{row.score}</td>
                <td className="px-5 py-4"><button className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800" aria-label="More actions"><MoreHorizontal className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
