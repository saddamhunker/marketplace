"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/data";

export function CategoryGrid() {
  const [showMore, setShowMore] = useState(false);
  const visibleCategories = showMore ? categories : categories.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {visibleCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.name} href={`/workers?category=${encodeURIComponent(category.name)}`} className="glass group flex min-h-20 items-center gap-3 rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-xl">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${category.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-black leading-tight sm:text-base">{category.name}</span>
            </Link>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setShowMore((value) => !value)}
        className="mx-auto flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
        aria-expanded={showMore}
      >
        {showMore ? "See less" : "See more"}
        {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
    </div>
  );
}
