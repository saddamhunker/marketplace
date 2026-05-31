"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ui";
import { products, type Product } from "@/lib/data";

type ListingRow = {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  price?: number | null;
  price_label?: string | null;
  location: string;
  images?: string[] | null;
  created_at?: string;
  profiles?: { full_name?: string | null } | null;
};

function mapListing(row: ListingRow): Product {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    price: row.price_label ?? (row.price ? `Rs ${row.price.toLocaleString("en-IN")}` : "Price on call"),
    location: row.location,
    posted: "Just now",
    seller: row.profiles?.full_name ?? "Verified seller",
    sellerTrust: 82,
    condition: "Listed",
    imageTone: "from-mint to-emerald-600",
    imageUrl: row.images?.[0],
    description: row.description ?? "Fresh local listing from MistriHub Market."
  };
}

export function MarketplaceGrid() {
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadListings() {
      try {
        const response = await fetch("/api/listings", { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));

        if (!active) return;

        if (!response.ok) {
          setMessage(response.status === 401 ? "Login ke baad aapki saved listings yahan dikhenge." : "");
          return;
        }

        const rows = Array.isArray(payload.data) ? payload.data : [];
        setRemoteProducts(rows.filter((row: ListingRow & { type?: string }) => row.type === "product").map(mapListing));
      } catch {
        if (active) setMessage("Live listings load nahi hui, demo marketplace dikh raha hai.");
      }
    }

    loadListings();

    return () => {
      active = false;
    };
  }, []);

  const allProducts = useMemo(() => {
    const remoteIds = new Set(remoteProducts.map((product) => product.id));
    return [...remoteProducts, ...products.filter((product) => !remoteIds.has(product.id))];
  }, [remoteProducts]);

  return (
    <>
      {message ? <p className="mb-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">{message}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {allProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </>
  );
}
