import { notFound } from "next/navigation";
import Link from "next/link";
import { Flag, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { ProductCard, SectionHeader, TrustBadge } from "@/components/ui";
import { products, type Product } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

type DetailParams = Promise<{ id: string }>;

type ListingProductRow = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  price: number | null;
  price_label: string | null;
  location: string;
  images: string[] | null;
  profiles?: { full_name?: string | null } | null;
  owner_id?: string | null;
};

async function getRemoteProduct(id: string): Promise<Product | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("listings")
      .select("id,title,category,description,price,price_label,location,images,owner_id")
      .eq("id", id)
      .eq("type", "product")
      .single();

    if (error || !data) return null;

    const row = data as ListingProductRow;
    let seller = "Verified seller";
    let sellerPhone: string | undefined;
    let sellerWhatsapp: string | undefined;

    if (row.owner_id) {
      const { data: profile } = await admin
        .from("profiles")
        .select("full_name, phone, whatsapp")
        .eq("id", row.owner_id)
        .single();

      seller = profile?.full_name ?? seller;
      sellerPhone = profile?.phone ?? undefined;
      sellerWhatsapp = profile?.whatsapp ?? undefined;
    }

    return {
      id: row.id,
      title: row.title,
      category: row.category,
      price: row.price_label ?? (row.price ? `Rs ${Number(row.price).toLocaleString("en-IN")}` : "Price on call"),
      location: row.location,
      posted: "Just now",
      seller,
      sellerPhone,
      sellerWhatsapp,
      sellerTrust: 82,
      condition: "Listed",
      imageTone: "from-mint to-emerald-600",
      imageUrl: row.images?.[0]?.startsWith("data:") && row.images[0].length > 120_000 ? undefined : row.images?.[0],
      description: row.description ?? "Fresh local listing from MistriHub Market."
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: DetailParams }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id) ?? await getRemoteProduct(id);
  return { title: product ? product.title : "Product Detail" };
}

export default async function ProductDetailPage({ params }: { params: DetailParams }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id) ?? await getRemoteProduct(id);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const contactMessage = encodeURIComponent(`Hi, I am interested in ${product.title} listed on MistriHub Market. Location: ${product.location}`);
  const contactHref = product.sellerWhatsapp
    ? `https://wa.me/${product.sellerWhatsapp.replace(/[^\d]/g, "")}?text=${contactMessage}`
    : `https://wa.me/?text=${contactMessage}`;

  return (
    <section className="section-pad">
      <div className="container-wide">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`overflow-hidden rounded-[2rem] bg-gradient-to-br ${product.imageTone} shadow-soft`}>
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={product.title} className="aspect-[4/3] h-full w-full object-cover" src={product.imageUrl} />
            ) : (
              <div className="aspect-[4/3]" />
            )}
          </div>
          <div className="glass rounded-[2rem] p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-black text-saffron">{product.category}</span>
              <TrustBadge score={product.sellerTrust} />
            </div>
            <h1 className="text-4xl font-black">{product.title}</h1>
            <p className="mt-3 text-3xl font-black text-saffron">{product.price}</p>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300"><MapPin className="h-4 w-4 text-mint" /> {product.location} • {product.posted}</p>
            <p className="mt-5 leading-7 text-zinc-700 dark:text-zinc-200">{product.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <a href={contactHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-ink"><MessageCircle className="h-4 w-4" /> Contact</a>
              <Link href="/dashboard#verification" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-mint px-4 py-3 text-sm font-black text-white"><ShieldCheck className="h-4 w-4" /> Verify Seller</Link>
              <a href={`/report?type=product&id=${product.id}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 dark:bg-red-500/10"><Flag className="h-4 w-4" /> Report</a>
            </div>
            <div className="mt-6 rounded-3xl bg-zinc-50 p-4 dark:bg-zinc-950">
              <p className="font-black">Seller: {product.seller}</p>
              <p className="text-sm text-zinc-500">Condition: {product.condition} • Trust checked profile</p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <SectionHeader title="Similar Deals Nearby" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
