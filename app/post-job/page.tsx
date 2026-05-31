import { CalendarClock, IndianRupee, MapPin, Send } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/forms/form-fields";
import { SectionHeader } from "@/components/ui";

export const metadata = { title: "Post a Job" };

export default function PostJobPage() {
  return (
    <section className="section-pad">
      <div className="container-wide grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow="Post Work" title="Get urgent help near you" description="Tell nearby verified workers what you need, when you need it, and your budget." />
          <div className="glass rounded-3xl p-5">
            {["Electrician at 2km may reply in 4 min", "3 plumbers available today", "Scam report protection enabled"].map((item) => (
              <p key={item} className="border-b border-zinc-100 py-3 text-sm font-bold last:border-0 dark:border-zinc-800">{item}</p>
            ))}
          </div>
        </div>
        <form className="glass grid gap-4 rounded-[2rem] p-5 sm:p-7">
          <TextField label="Work title" placeholder="Fan repair, pipe leakage, house painting..." />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Category" options={["Electrician", "Plumber", "Mechanic", "Painter", "Labour", "Other"]} />
            <TextField label="Location" placeholder="Area, city" icon={<MapPin className="h-4 w-4" />} />
          </div>
          <TextAreaField placeholder="Describe the work, urgency, photos needed, preferred time..." />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Budget" placeholder="Rs 500 - 1200" icon={<IndianRupee className="h-4 w-4" />} />
            <TextField label="Needed by" placeholder="Today 6 PM" icon={<CalendarClock className="h-4 w-4" />} />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white dark:bg-white dark:text-ink"><Send className="h-4 w-4" /> Post Your Work</button>
        </form>
      </div>
    </section>
  );
}
