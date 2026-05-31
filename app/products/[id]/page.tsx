import { notFound } from "next/navigation";
import { Flag, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { ProductCard, SectionHeader, TrustBadge } from "@/components/ui";
import { products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

type DetailParams = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: DetailParams }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  return { title: product ? product.title : "Product Detail" };
}

export default async function ProductDetailPage({ params }: { params: DetailParams }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <section className="section-pad">
      <div className="container-wide">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`aspect-[4/3] rounded-[2rem] bg-gradient-to-br ${product.imageTone} shadow-soft`} />
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
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-ink"><MessageCircle className="h-4 w-4" /> Contact</button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-mint px-4 py-3 text-sm font-black text-white"><ShieldCheck className="h-4 w-4" /> Verify Seller</button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 dark:bg-red-500/10"><Flag className="h-4 w-4" /> Report</button>
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
