"use client";

import { useState } from "react";
import { BadgeCheck, IndianRupee, MapPin, Save } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/forms/form-fields";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const skills = ["Electrician", "Plumber", "Mechanic", "AC Repair", "Carpenter", "Painter", "Labour", "Mobile Repair", "Delivery"];

export function WorkerProfileForm() {
  const [skill, setSkill] = useState(skills[0]);
  const [location, setLocation] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("Saving worker profile...");

    try {
      const session = isSupabaseConfigured() ? (await createClient().auth.getSession()).data.session : null;
      const response = await fetch("/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          skill,
          location,
          bio,
          experienceYears: Number(experienceYears || 0),
          priceMin: priceMin ? Number(priceMin) : null,
          priceMax: priceMax ? Number(priceMax) : null,
          availability: "Available Now"
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(payload.error === "Authentication required" ? "Pehle login karo, phir worker profile save hogi." : payload.error ?? "Worker profile save failed.");
        return;
      }

      setStatus("Worker profile saved. Ab /workers page par show hoga.");
    } catch {
      setStatus("Network issue. Local server/Supabase check karo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint/10 text-mint">
          <BadgeCheck className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-black">Create / Update Worker Profile</h2>
          <p className="text-sm font-semibold text-zinc-500">Ye save karne ke baad worker listing mein show hoga.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Skill" options={skills} value={skill} onChange={(event) => setSkill(event.target.value)} />
        <TextField label="Location" placeholder="Area, city" icon={<MapPin className="h-4 w-4" />} required value={location} onChange={(event) => setLocation(event.target.value)} />
        <TextField label="Experience years" placeholder="5" type="number" value={experienceYears} onChange={(event) => setExperienceYears(event.target.value)} />
        <TextField label="Minimum price" placeholder="250" type="number" icon={<IndianRupee className="h-4 w-4" />} value={priceMin} onChange={(event) => setPriceMin(event.target.value)} />
        <TextField label="Maximum price" placeholder="1200" type="number" icon={<IndianRupee className="h-4 w-4" />} value={priceMax} onChange={(event) => setPriceMax(event.target.value)} />
      </div>

      <div className="mt-4">
        <TextAreaField placeholder="Short bio: kaunsa kaam karte ho, emergency service, timing..." value={bio} onChange={(event) => setBio(event.target.value)} />
      </div>

      {status ? <p className="mt-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">{status}</p> : null}

      <button disabled={saving} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white disabled:opacity-60 dark:bg-white dark:text-ink">
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Worker Profile"}
      </button>
    </form>
  );
}
