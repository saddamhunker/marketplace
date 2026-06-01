import { AlertTriangle, Boxes, Flag, ShieldCheck, UsersRound } from "lucide-react";
import { AdminTable } from "@/components/admin-table";
import { SectionHeader } from "@/components/ui";
import { marketplaceCategories, products, workerCategories } from "@/lib/data";
import { getSupabaseWorkers } from "@/lib/workers-data";

export const metadata = { title: "Admin Panel" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

const adminStats = [
  { label: "Users", value: "42,318", icon: UsersRound },
  { label: "Workers", value: "12,486", icon: ShieldCheck },
  { label: "Products", value: "48,902", icon: Boxes },
  { label: "Open reports", value: "37", icon: AlertTriangle }
];

const adminCategories = [
  ...workerCategories.map((category) => category.name),
  ...marketplaceCategories.map((category) => category.name),
  "Featured Worker",
  "Featured Product"
];

export default async function AdminPage() {
  const workers = await getSupabaseWorkers(6);
  const workerRows = workers.map((worker) => ({ name: worker.name, type: worker.skill, status: worker.availability, score: `${worker.trustScore}/100` }));
  const productRows = products.slice(0, 6).map((product) => ({ name: product.title, type: product.category, status: product.condition, score: `${product.sellerTrust}/100` }));

  return (
    <section className="section-pad">
      <div className="container-wide space-y-6">
        <SectionHeader eyebrow="Admin" title="MistriHub Market Control Center" description="Manage users, workers, products, reports, categories, featured listings, and marketplace trust signals." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass rounded-3xl p-5">
                <Icon className="mb-4 h-6 w-6 text-saffron" />
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="text-sm font-bold text-zinc-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <AdminTable title="Manage Workers" rows={workerRows} />
          <AdminTable title="Manage Products" rows={productRows} />
        </div>
        <div className="glass rounded-[2rem] p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-black"><Flag className="h-5 w-5 text-red-500" /> Reports Queue</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {["Fake phone number report", "Duplicate product listing", "Suspicious seller message"].map((report) => (
              <div key={report} className="rounded-2xl bg-white p-4 dark:bg-zinc-950">
                <p className="font-black">{report}</p>
                <p className="mt-2 text-sm text-zinc-500">Priority review needed</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-[2rem] p-5">
          <h3 className="mb-4 text-lg font-black">Categories & Featured Listings</h3>
          <div className="flex flex-wrap gap-3">
            {adminCategories.map((item) => (
              <button key={item} className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-black dark:bg-zinc-800">{item}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
