import { BadgeCheck, ImagePlus, ShieldCheck, Zap } from "lucide-react";
import { ListingPostForm } from "@/components/forms/listing-post-form";
import { SectionHeader } from "@/components/ui";

export const metadata = { title: "Post a Product" };

export default function PostProductPage() {
  return (
    <section className="section-pad">
      <div className="container-wide grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow="Sell Nearby" title="List your item in minutes" description="Add price, condition, location, and seller verification details to build buyer confidence." />
          <div className="glass rounded-3xl p-5">
            <div className="grid aspect-video place-items-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-center">
                <ImagePlus className="mx-auto mb-3 h-8 w-8 text-saffron" />
                <p className="font-black">Real photo upload</p>
                <p className="text-sm text-zinc-500">Preview, save, and show in marketplace</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm font-bold">
              {[
                { icon: BadgeCheck, text: "Verified seller badge support" },
                { icon: ShieldCheck, text: "Scam report protection" },
                { icon: Zap, text: "Instant buyer contact ready" }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-950/60">
                    <Icon className="h-4 w-4 text-mint" />
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ListingPostForm mode="product" />
      </div>
    </section>
  );
}
