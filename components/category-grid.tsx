import Link from "next/link";
import { categories } from "@/lib/data";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link key={category.name} href={`/workers?category=${encodeURIComponent(category.name)}`} className="glass group flex items-center gap-3 rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-xl">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${category.tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-black">{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
