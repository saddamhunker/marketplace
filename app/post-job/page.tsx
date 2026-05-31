import { BellRing, MapPin, ShieldCheck } from "lucide-react";
import { ListingPostForm } from "@/components/forms/listing-post-form";
import { SectionHeader } from "@/components/ui";

export const metadata = { title: "Post a Job" };

export default function PostJobPage() {
  return (
    <section className="section-pad">
      <div className="container-wide grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow="Post Work" title="Get urgent help near you" description="Tell nearby verified workers what you need, when you need it, and your budget." />
          <div className="glass rounded-3xl p-5">
            {[
              { icon: MapPin, text: "Electrician at 2km may reply in 4 min" },
              { icon: BellRing, text: "Nearby workers can get instant alerts" },
              { icon: ShieldCheck, text: "Scam report protection enabled" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <p key={item.text} className="flex items-center gap-3 border-b border-zinc-100 py-3 text-sm font-bold last:border-0 dark:border-zinc-800">
                  <Icon className="h-4 w-4 text-saffron" />
                  {item.text}
                </p>
              );
            })}
          </div>
        </div>
        <ListingPostForm mode="job" />
      </div>
    </section>
  );
}
