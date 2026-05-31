import Link from "next/link";
import { AlertTriangle, ArrowLeft, Send } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/forms/form-fields";
import { SectionHeader } from "@/components/ui";

export const metadata = { title: "Report an Issue" };

export default function ReportPage() {
  return (
    <section className="section-pad">
      <div className="container-wide grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-black text-zinc-600 hover:text-saffron dark:text-zinc-300">
            <ArrowLeft className="h-4 w-4" />
            Back to MistriHub
          </Link>
          <SectionHeader
            eyebrow="Safety"
            title="Report scam, fake profile, or wrong listing"
            description="Share the issue clearly. Admin can review reports from the admin panel once Supabase is connected."
          />
          <div className="premium-card p-5">
            <AlertTriangle className="mb-4 h-8 w-8 text-red-500" />
            <p className="text-sm font-semibold leading-6 text-zinc-600 dark:text-zinc-300">
              For urgent safety concerns, call the person only if you trust the listing. MistriHub should be used with verified profiles and trust scores.
            </p>
          </div>
        </div>
        <form className="premium-card grid gap-4 p-5 sm:p-7">
          <TextField label="Your mobile or email" placeholder="+91 98765 43210 or you@example.com" />
          <SelectField label="Report type" options={["Fake worker profile", "Fake product listing", "Wrong business details", "Spam call/message", "Payment scam", "Other"]} />
          <TextField label="Profile / listing / business name" placeholder="Name shown on MistriHub" />
          <TextAreaField placeholder="Describe what happened..." />
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white dark:bg-white dark:text-ink">
            <Send className="h-4 w-4" />
            Submit Report
          </button>
        </form>
      </div>
    </section>
  );
}
