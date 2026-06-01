import { BadgeCheck, ShieldCheck, Zap } from "lucide-react";
import { ListingPostForm } from "@/components/forms/listing-post-form";
import { UploadShortcut } from "@/components/forms/upload-shortcut";
import { SectionHeader } from "@/components/ui";

export const metadata = { title: "Post a Product" };

export default function PostProductPage() {
  return (
    <section className="section-pad">
      <div className="container-wide grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow="Sell Nearby" title="List your item in minutes" description="Add price, condition, location, and seller verification details to build buyer confidence." />
          <div className="glass rounded-3xl p-5">
            <UploadShortcut inputId="product-photo-input" title="Real photo upload" description="Click here to choose photos" />
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
