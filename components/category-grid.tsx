"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { marketplaceCategories, workerCategories, type CategoryItem } from "@/lib/data";

export function CategoryGrid() {
  const [showWorkerMore, setShowWorkerMore] = useState(false);
  const [showMarketMore, setShowMarketMore] = useState(false);

  return (
    <div className="space-y-5">
      <CategorySection
        eyebrow="Local Worker Services"
        title="Book trusted workers near you"
        description="Plumber, electrician, mechanic, driver, painter, labour and repair services."
        categories={workerCategories}
        hrefBase="/workers"
        previewCount={5}
        showMore={showWorkerMore}
        onToggle={() => setShowWorkerMore((value) => !value)}
      />

      <CategorySection
        eyebrow="Marketplace Categories"
        title="Buy and sell local items"
        description="Mobile, bike, car, furniture, property and other nearby deals."
        categories={marketplaceCategories}
        hrefBase="/marketplace"
        previewCount={4}
        showMore={showMarketMore}
        onToggle={() => setShowMarketMore((value) => !value)}
      />
    </div>
  );
}

function CategorySection({
  eyebrow,
  title,
  description,
  categories,
  hrefBase,
  previewCount,
  showMore,
  onToggle
}: {
  eyebrow: string;
  title: string;
  description: string;
  categories: CategoryItem[];
  hrefBase: "/workers" | "/marketplace";
  previewCount: number;
  showMore: boolean;
  onToggle: () => void;
}) {
  const visibleCategories = showMore ? categories : categories.slice(0, previewCount);
  const hasMore = categories.length > previewCount;

  return (
    <div className="rounded-[1.75rem] border border-zinc-200/80 bg-white/70 p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60 sm:p-4">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-saffron">{eyebrow}</p>
          <h3 className="text-xl font-black text-ink dark:text-white">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-zinc-500">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {visibleCategories.map((category) => <CategoryLink key={category.name} category={category} hrefBase={hrefBase} />)}
      </div>
      {hasMore ? (
        <button
          type="button"
          onClick={onToggle}
          className="mx-auto mt-3 flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          aria-expanded={showMore}
        >
          {showMore ? "See less" : "See more"}
          {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      ) : null}
    </div>
  );
}

function CategoryLink({ category, hrefBase }: { category: CategoryItem; hrefBase: "/workers" | "/marketplace" }) {
  const Icon = category.icon;

  return (
    <Link href={`${hrefBase}?category=${encodeURIComponent(category.name)}`} className="glass group flex min-h-20 items-center gap-3 rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-xl">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${category.tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-black leading-tight sm:text-base">{category.name}</span>
    </Link>
  );
}
